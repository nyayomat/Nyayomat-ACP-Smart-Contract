import { readFileSync, writeFileSync } from "fs";
import { schedule } from "node-cron";
import { resolve } from "path";
import {
  mapInventoryToTezos,
  mapInvoiceToTezos,
  mapProductToTezos,
  mapAssetToTezos,
  mapUserToTezos,
  mapTransactionToTezos,
  mapProviderToTezos,
} from "./common";
import { databaseWrapper, platformWrapper } from "./core";
import {
  ProductDB,
  ProviderDB,
  UserDB,
  AssetDB,
  TransactionDB,
  InvoiceDB,
  InventoryDB,
} from "./types";
import { getRecordsToAddAndUpdate } from "./utils";

const Main = async () => {
  console.log(`---`.repeat(10));
  console.log(`Starting...`);
  console.log(`---`.repeat(10));
  console.info(`Scheduling...`);
  /// @dev Run task every day at midnight
  schedule(
    `*/20 * * * * * `,
    async () => {
      console.log("Running task every day at midnight");
      /// STEP 1: Fetch data from database
      console.info(`Fetching providers...`);
      const inventoriesDB: InventoryDB[] = await databaseWrapper.fetchTable(
        "inventories"
      );
      const invoicesDB: InvoiceDB[] = await databaseWrapper.fetchTable(
        "invoices"
      );
      const assetsDB: AssetDB[] = await databaseWrapper.fetchTable(
        "tbl_acp_assets"
      );
      const usersDB: UserDB[] = await databaseWrapper.fetchTable("users");
      const providerTxDB: TransactionDB[] = await databaseWrapper.fetchTable(
        "tbl_acp_asset_provider_transaction"
      );
      const merchantTxDB: TransactionDB[] = await databaseWrapper.fetchTable(
        "tbl_acp_merchant_transaction"
      );
      const productsDB: ProductDB[] = await databaseWrapper.fetchTable(
        "products"
      );

      const providersDB: ProviderDB[] = await databaseWrapper.fetchTable(
        "tbl_acp_asset_providers"
      );

      /// STEP pre 2: Combine records

      const db_records: Record<
        string,
        {
          create: any[];
          update: any[];
          records: any[];
        }
      > = {
        /// Get Inventories to add or update
        inventory: await getRecordsToAddAndUpdate(inventoriesDB, "inventory"),

        /// Get Products to add or update
        product: await getRecordsToAddAndUpdate(productsDB, "product"),

        /// Get Invoices to add or update
        invoice: await getRecordsToAddAndUpdate(invoicesDB, "invoice"),

        /// Get Assets to add or update
        asset: await getRecordsToAddAndUpdate(assetsDB, "asset"),

        /// Get Users to add or update
        user: await getRecordsToAddAndUpdate(usersDB, "user"),

        /// Get Provider Transactions to add or update
        /// Get Merchant Transactions to add or update

        transaction: await getRecordsToAddAndUpdate(
          [providerTxDB, ...merchantTxDB],
          "transaction"
        ),

        /// Get Providers to add or update
        provider: await getRecordsToAddAndUpdate(providersDB, "provider"),
      };

      const records: {
        data: {
          update: any[];
          create: any[];
        };
        contract: string;
      }[] = Object.entries(db_records).map(([contract, record]) => {
        let data: any;
        switch (contract) {
          case "provider":
            data = {
              create: mapProviderToTezos(record.create, "create"),
              update: mapProviderToTezos(record.update, "update"),
            };
            break;
          case "inventory":
            data = {
              create: mapInventoryToTezos(record.create, "create"),
              update: mapInventoryToTezos(record.update, "update"),
            };
            break;
          case "invoice":
            data = {
              create: mapInvoiceToTezos(record.create, "create"),
              update: mapInvoiceToTezos(record.update, "update"),
            };
            break;
          case "product":
            data = {
              create: mapProductToTezos(record.create, "create"),
              update: mapProductToTezos(record.update, "update"),
            };
            break;
          case "asset":
            data = {
              create: mapAssetToTezos(record.create, "create"),
              update: mapAssetToTezos(record.update, "update"),
            };
            break;
          case "user":
            data = {
              create: mapUserToTezos(record.create, "create"),
              update: mapUserToTezos(record.update, "update"),
            };
            break;
          case "transaction":
            data = {
              create: mapTransactionToTezos(record.create, "create"),
              update: mapTransactionToTezos(record.update, "update"),
            };
            break;

          default:
            throw new Error("Invalid contract");
        }
        return {
          data,
          contract: contract,
        };
      });

      /// Get Contract addresses from contracts.json
      const contracts = JSON.parse(
        readFileSync(
          resolve(__dirname, "../../scripts/utils/contracts.json"),
          "utf8"
        )
      );

      /// @dev Add or update providers in onchain storage
      records.forEach(async (record) => {
        if (!record.data.create.length) {
          /// SKIP if no records to add
          console.info(`No new records to add for ${record.contract}`);
        } else {
          console.info(
            `Adding ${record.data.create.length} new records to ${record.contract}...`
          );
          /// Get smart contract address from contracts.json
          const contractAddress = contracts[record.contract];
          if (!contractAddress) {
            console.error(`Contract address not found for ${record.contract}`);
            return;
          }
          try {
            /// @dev Add batch insert
            await platformWrapper.create(record.data.create, contractAddress);
            /// TODO update backups refs after an update
            writeFileSync(
              resolve(__dirname, `../backups/${record.contract}.json`),
              JSON.stringify(
                Object.fromEntries(
                  db_records[record.contract].records.map((r) => [r.id, r])
                ),
                null,
                2
              )
            );
          } catch (error) {
            console.error(
              `Failed with error: ${error} while adding records to ${record.contract}`
            );
          }
        }
        if (!record.data.update.length) {
          /// SKIP if no records to update
          console.info(`No records to update for ${record.contract}`);
        } else {
          console.info(
            `Updating ${record.data.update.length} records in ${record.contract}...`
          );
          /// Get smart contract address from contracts.json
          const contractAddress = contracts[record.contract];
          if (!contractAddress) {
            console.error(`Contract address not found for ${record.contract}`);
            return;
          }
          try {
            /// @dev batch update
            await platformWrapper.update(record.data.update, contractAddress);
          } catch (error) {
            /// TODO update backups refs after an update
            writeFileSync(
              resolve(__dirname, `../backups/${record.contract}.json`),
              JSON.stringify(
                Object.fromEntries(
                  db_records[record.contract].records.map((r) => [r.id, r])
                ),
                null,
                2
              )
            );
            console.error(
              `Failed with error: ${error} while updating records in ${record.contract}`
            );
          }
        }
      });

      /// @dev Update records in onchain storage
    },
    {
      scheduled: true,
      timezone: "Africa/Nairobi",
    }
  );
  console.log(`---`.repeat(3));
  console.info(`Done. ✔️`);
};

Main();
