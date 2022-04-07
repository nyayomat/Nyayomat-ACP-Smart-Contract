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
    `*/1 * * * * `,
    async () => {
      console.log("Running task every day at midnight\n---");
      /// STEP 1: Fetch data from database
      console.info(
        `Fetching providers, inventories, invoices, assets, users records...`
      );
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

      /// STEP 2: Get records to add or update
      console.info(`- - -`.repeat(3));
      console.log(`Getting records to add and update...`);
      console.info(`- - -`.repeat(3));
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

      console.info(
        `Found ${Object.values(db_records).reduce(
          (acc, c) => (acc += c.create.length),
          0
        )} records to add ${Object.values(db_records).reduce(
          (acc, c) => (acc += c.update.length),
          0
        )} update.`
      );
      console.info(`- - -`.repeat(3));
      /// STEP 3: Map records to Tezos format
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
              create: mapProviderToTezos(record.create),
              update: mapProviderToTezos(record.update),
            };
            break;
          case "inventory":
            data = {
              create: mapInventoryToTezos(record.create),
              update: mapInventoryToTezos(record.update),
            };
            break;
          case "invoice":
            data = {
              create: mapInvoiceToTezos(record.create),
              update: mapInvoiceToTezos(record.update),
            };
            break;
          case "product":
            data = {
              create: mapProductToTezos(record.create),
              update: mapProductToTezos(record.update),
            };
            break;
          case "asset":
            data = {
              create: mapAssetToTezos(record.create),
              update: mapAssetToTezos(record.update),
            };
            break;
          case "user":
            data = {
              create: mapUserToTezos(record.create),
              update: mapUserToTezos(record.update),
            };
            break;
          case "transaction":
            data = {
              create: mapTransactionToTezos(record.create),
              update: mapTransactionToTezos(record.update),
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
      try {
        // await Promise.resolve(
        // records.forEach(async (record) => {
        for (let i = 0; i < records.length; i++) {
          const record = records[i];

          if (!record.data.create.length) {
            /// SKIP if no records to add
            console.info(
              `No new records to add to ${record.contract}. SKIPPING...\n---`
            );
          } else {
            console.info(
              `Adding ${record.data.create.length} new records to ${record.contract}...\n- - -`
            );
            /// Get smart contract address from contracts.json
            const contractAddress = contracts[record.contract];
            if (!contractAddress) {
              console.error(
                `Contract address not found for ${record.contract}. SKIPPING\n---`
              );
              continue;
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
            console.info(
              `No records to update for ${record.contract}. SKIPPING...\n---`
            );
          } else {
            console.info(
              `Updating ${record.data.update.length} records in ${record.contract}...\n---`
            );
            /// Get smart contract address from contracts.json
            const contractAddress = contracts[record.contract];
            if (!contractAddress) {
              console.error(
                `Contract address not found for ${record.contract}`
              );
              continue;
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
        }
        console.info(`---`.repeat(3));
        console.info(
          `Successfully completed updating and adding records to onchain storage. ✔️\n---`
        );
      } catch (error) {
        console.error(
          `Failed with ${error} while adding and updating records in onchain storage`
        );
      }
      /// @dev Update records in onchain storage
    },
    {
      scheduled: true,
      timezone: "Africa/Nairobi",
    }
  );
  console.log(`---`.repeat(3));
  console.info(`Done. ✔️\n---`);
};

Main();
