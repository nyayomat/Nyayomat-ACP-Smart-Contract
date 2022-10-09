import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { schedule } from "node-cron";
import { resolve } from "path";
import { config } from "../config";
import {
  mapAssetToTezos,
  mapUserToTezos,
  mapTransactionToTezos,
  mapProviderToTezos,
  mapOrderToTezos,
} from "./common";
import { Database, platformWrapper } from "./core";
import { ProviderDB, UserDB, AssetDB, TransactionDB, OrdersDB } from "./types";
import { chunk, getRecordsToAddAndUpdate } from "./utils";

const Main = async () => {
  console.log(`---`.repeat(10));
  console.log(`Starting...`);
  console.log(`---`.repeat(10));
  console.info(`Scheduling...`);
  /// @dev Run task every day at midnight
  const [HOUR, MINUTE] = config.BACKUP_TIME.split(":");
  schedule(
    `${MINUTE} ${HOUR} * * *`,
    async () => {
      console.log("Running task every day at midnight\n---");
      /// STEP 1: Fetch data from database
      console.info(
        `Fetching providers, inventories, invoices, assets, users records...`
      );
<<<<<<< HEAD

      let databaseWrapper = new Database();

=======
      const databaseWrapper = new Database();
>>>>>>> dca5a5aa0ff68ec7cf7a9e02c0cbca39e7c8f983
      /// @dev Database Tables to read from
      const ProviderAssetTable = "tbl_acp_assets";
      const MerchantAssetTable = "tbl_acp_merchant_assets";
      const UsersTable = "users";
      const ProviderTxTable = "tbl_acp_asset_provider_transaction";
      const MerchantTxTable = "tbl_acp_merchant_transaction";
      const ProvidersTable = "tbl_acp_asset_providers";

      const ProviderOrderTable = "tbl_acp_asset_provider_order";
      const MerchantOrderTable = "tbl_acp_merchant_asset_order";

      let merchatAssetsDB: AssetDB[] = await databaseWrapper.fetchTable(
        MerchantAssetTable
      );
      /// @dev filter out pending assets
      merchatAssetsDB = merchatAssetsDB.filter(
        (asset) => asset.status?.toLowerCase() == "pending"
      );

      /// @notice ASSETS
      let providerAssetsDB: AssetDB[] = await databaseWrapper.fetchTable(
        ProviderAssetTable
      );
      /// @dev filter out pending assets
      providerAssetsDB = providerAssetsDB.filter(
        (asset) => asset.status?.toLowerCase() !== "pending"
      );

      /// @notice USERS
      const usersDB: UserDB[] = await databaseWrapper.fetchTable(UsersTable);

      /// @notice TRANSACTIONS
      const providerTxDB: TransactionDB[] = await databaseWrapper.fetchTable(
        ProviderTxTable
      );
      const merchantTxDB: TransactionDB[] = await databaseWrapper.fetchTable(
        MerchantTxTable
      );

      /// @notice Provider
      const providersDB: ProviderDB[] = await databaseWrapper.fetchTable(
        ProvidersTable
      );

      /// @notice ORDERS
      let providerOrdersDB: OrdersDB[] = await databaseWrapper.fetchTable(
        ProviderOrderTable
      );
      // @dev capture only delivered provider orders
      providerOrdersDB = providerOrdersDB.filter(
        (order) => order.status === "delivered"
      );

      let merchantOrdersDB: OrdersDB[] = await databaseWrapper.fetchTable(
        MerchantOrderTable
      );

      // close the db connection
      databaseWrapper.close();

      /// @dev capture only delivered merchant orders
      merchantOrdersDB = merchantOrdersDB.filter(
        (order) => order.status === "delivered"
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
          backup_file_name: string;
          db_table: string;
        }
      > = {
        /// Get Assets to add or update
        asset: await getRecordsToAddAndUpdate(
          merchatAssetsDB,
          "merchantAssets",
          MerchantAssetTable
        ),

        asset_provider: await getRecordsToAddAndUpdate(
          providerAssetsDB,
          "providerAssets",
          ProviderAssetTable
        ),

        /// Get Users to add or update
        user: await getRecordsToAddAndUpdate(usersDB, "users", UsersTable),

        /// Get Provider Transactions to add or update
        /// Get Merchant Transactions to add or update
        transaction: await getRecordsToAddAndUpdate(
          providerTxDB,
          "providerTxs",
          ProviderTxTable
        ),
        transaction_merchant: await getRecordsToAddAndUpdate(
          merchantTxDB,
          "merchantTxs",
          MerchantTxTable
        ),

        /// Get Providers to add or update
        provider: await getRecordsToAddAndUpdate(
          providersDB,
          "providers",
          ProvidersTable
        ),

        /// @notice Orders
        /// Get Provider and Merchant orders to add or update
        order: await getRecordsToAddAndUpdate(
          providerOrdersDB,
          "providerOrders",
          ProviderOrderTable
        ),
        order_merchant: await getRecordsToAddAndUpdate(
          merchantOrdersDB,
          "merchantOrders",
          MerchantOrderTable
        ),
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
          backup_file_name: string;
        };
        contract: string;
        backup_file_name: string;
      }[] = Object.entries(db_records).map(([contract, record]) => {
        let data: any;
        switch (contract) {
          case "provider":
            data = {
              create: mapProviderToTezos(record.create),
              update: mapProviderToTezos(record.update),
            };
            break;
          case "asset":
          case "asset_provider":
            data = {
              create: mapAssetToTezos(record.create, record.db_table),
              update: mapAssetToTezos(record.update, record.db_table),
            };
            break;
          case "user":
            data = {
              create: mapUserToTezos(record.create),
              update: mapUserToTezos(record.update),
            };
            break;
          case "transaction":
          case "transaction_merchant":
            data = {
              create: mapTransactionToTezos(record.create, record.db_table),
              update: mapTransactionToTezos(record.update, record.db_table),
            };
            break;
          case "order":
          case "order_merchant":
            data = {
              create: mapOrderToTezos(record.create, record.db_table),
              update: mapOrderToTezos(record.update, record.db_table),
            };
            break;
          default:
            throw new Error("Invalid contract");
        }
        return {
          data,
          contract: contract,
          backup_file_name: record.backup_file_name,
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

          const contractName = record.contract.split("_")[0];

          if (!record.data.create.length) {
            /// SKIP if no records to add
            console.info(
              `No new records to add to ${record.contract}. SKIPPING...\n---`
            );
          } else {
            const chunks = chunk(record.data.create, 60);
            for (let j = 0; j < chunks.length; j++) {
              const data = chunks[j];

              console.info(
                `Adding ${data.length} new records to ${record.contract}...\n- - -`
              );
              /// Get smart contract address from contracts.json
              const contractAddress = contracts[contractName];
              if (!contractAddress) {
                console.error(
                  `Contract address not found for ${record.contract}. SKIPPING\n---`
                );
                continue;
              }
              try {
                /// @dev Add batch insert
                await platformWrapper.create(data, contractAddress);
                /// TODO update backups refs after an update
                let dir = resolve(__dirname, `../backups/`);
                if (!existsSync(dir)) {
                  mkdirSync(dir, { recursive: true });
                }
                writeFileSync(
                  resolve(
                    __dirname,
                    `../backups/${record.backup_file_name}.json`
                  ),
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
          }
          if (!record.data.update.length) {
            /// SKIP if no records to update
            console.info(
              `No records to update for ${record.contract}. SKIPPING...\n---`
            );
          } else {
            const chunks = chunk(record.data.update, 60);
            for (let j = 0; j < chunks.length; j++) {
              const data = chunks[j];

              console.info(
                `Updating ${data.length} records in ${record.contract}...\n---`
              );
              /// Get smart contract address from contracts.json
              const contractAddress = contracts[contractName];
              if (!contractAddress) {
                console.error(
                  `Contract address not found for ${record.contract}`
                );
                continue;
              }
              try {
                /// @dev batch update
                await platformWrapper.update(data, contractAddress);
              } catch (error) {
                /// TODO update backups refs after an update
                writeFileSync(
                  resolve(
                    __dirname,
                    `../backups/${record.backup_file_name}.json`
                  ),
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
