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
  mapOrderToTezos,
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
  OrdersDB,
} from "./types";
import { chunk, getRecordsToAddAndUpdate } from "./utils";

const Main = async () => {
  console.log(`---`.repeat(10));
  console.log(`Starting...`);
  console.log(`---`.repeat(10));
  console.info(`Scheduling...`);
  /// @dev Run task every day at midnight
  // schedule(
  //   `* */3 * * * * `,
  //   async () => {
  console.log("Running task every day at midnight\n---");
  /// STEP 1: Fetch data from database
  console.info(
    `Fetching providers, inventories, invoices, assets, users records...`
  );

  /// @notice ASSETS
  let providerAssetsDB: AssetDB[] = await databaseWrapper.fetchTable(
    "tbl_acp_assets"
  );
  /// @dev filter out pending assets
  providerAssetsDB = providerAssetsDB.filter(
    (asset) => asset.status !== "pending"
  );

  const merchatAssetsDB: AssetDB[] = await databaseWrapper.fetchTable(
    "tbl_acp_merchant_assets"
  );

  /// @notice USERS
  const usersDB: UserDB[] = await databaseWrapper.fetchTable("users");

  /// @notice TRANSACTIONS
  const providerTxDB: TransactionDB[] = await databaseWrapper.fetchTable(
    "tbl_acp_asset_provider_transaction"
  );
  const merchantTxDB: TransactionDB[] = await databaseWrapper.fetchTable(
    "tbl_acp_merchant_transaction"
  );

  /// @notice Provider
  const providersDB: ProviderDB[] = await databaseWrapper.fetchTable(
    "tbl_acp_asset_providers"
  );

  /// @notice ORDERS
  let providerOrdersDB: OrdersDB[] = await databaseWrapper.fetchTable(
    "tbl_acp_asset_provider_order"
  );
  // @dev capture only delivered provider orders
  providerOrdersDB = providerOrdersDB.filter(
    (order) => order.status === "delivered"
  );

  let merchantOrdersDB: OrdersDB[] = await databaseWrapper.fetchTable(
    "tbl_acp_merchant_asset_order"
  );

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
    }
  > = {
    /// Get Assets to add or update
    asset: {
      ...(await getRecordsToAddAndUpdate(merchatAssetsDB, "merchantAssets")),
      ...(await getRecordsToAddAndUpdate(providerAssetsDB, "providerAssets")),
    },

    /// Get Users to add or update
    user: await getRecordsToAddAndUpdate(usersDB, "users"),

    /// Get Provider Transactions to add or update
    /// Get Merchant Transactions to add or update
    transaction: {
      ...(await getRecordsToAddAndUpdate(providerTxDB, "providerTxs")),
      ...(await getRecordsToAddAndUpdate(merchantTxDB, "merchantTxs")),
    },

    /// Get Providers to add or update
    provider: await getRecordsToAddAndUpdate(providersDB, "providers"),

    /// @notice Orders
    /// Get Provider and Merchant orders to add or update
    order: {
      ...(await getRecordsToAddAndUpdate(providerOrdersDB, "providerOrders")),
      ...(await getRecordsToAddAndUpdate(merchantOrdersDB, "merchantOrders")),
    },
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
      case "order":
        data = {
          create: mapOrderToTezos(record.create),
          update: mapOrderToTezos(record.update),
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
          const contractAddress = contracts[record.contract];
          if (!contractAddress) {
            console.error(
              `Contract address not found for ${record.contract}. SKIPPING\n---`
            );
            continue;
          }
          try {
            console.log({
              record,
            });
            /// @dev Add batch insert
            await platformWrapper.create(data, contractAddress);
            /// TODO update backups refs after an update

            writeFileSync(
              resolve(__dirname, `../backups/${record.backup_file_name}.json`),
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
          const contractAddress = contracts[record.contract];
          if (!contractAddress) {
            console.error(`Contract address not found for ${record.contract}`);
            continue;
          }
          try {
            /// @dev batch update
            await platformWrapper.update(data, contractAddress);
          } catch (error) {
            /// TODO update backups refs after an update
            writeFileSync(
              resolve(__dirname, `../backups/${record.backup_file_name}.json`),
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
  //   },
  //   {
  //     scheduled: true,
  //     timezone: "Africa/Nairobi",
  //   }
  // );
  console.log(`---`.repeat(3));
  console.info(`Done. ✔️\n---`);
};

Main();
