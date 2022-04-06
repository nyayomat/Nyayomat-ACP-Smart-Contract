import { readFileSync } from "fs";
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
      const inventoriesDB = await databaseWrapper.fetchTable("inventories");
      const invoicesDB = await databaseWrapper.fetchTable("invoices");
      const assetsDB = await databaseWrapper.fetchTable("tbl_acp_assets");
      const usersDB = await databaseWrapper.fetchTable("users");
      const providerTxDB = await databaseWrapper.fetchTable(
        "tbl_acp_asset_provider_transaction"
      );
      const merchantTxDB = await databaseWrapper.fetchTable(
        "tbl_acp_merchant_transaction"
      );
      const productsDB = await databaseWrapper.fetchTable("products");

      const providersDB = await databaseWrapper.fetchTable(
        "tbl_acp_asset_providers"
      );

      /// STEP 2: Map data to Tezos format
      const inventories = mapInventoryToTezos(inventoriesDB);
      const products = mapProductToTezos(productsDB);
      const invoices = mapInvoiceToTezos(invoicesDB);
      const assets = mapAssetToTezos(assetsDB);
      const providers = mapProviderToTezos(providersDB);
      const users = mapUserToTezos(usersDB);
      const providerTxs = mapTransactionToTezos(providerTxDB);
      const merchantsTxs = mapTransactionToTezos(merchantTxDB);

      /// STEP 3: Add new records to onchain storage

      const newRecords = {
        // inventory: inventories.slice(0, 2),
        // product: products.slice(0, 2),
        // invoice: invoices.slice(0, 2),
        // asset: assets.slice(0, 2),
        // provider: providers.slice(0, 3), // DONE
        transaction: [...providerTxs, ...merchantsTxs].slice(0, 2), // DONE
        // user: users.slice(0, 5), // DONE
      };

      /// Get Contract addresses from contracts.json
      const contracts = JSON.parse(
        readFileSync(
          resolve(__dirname, "../../scripts/utils/contracts.json"),
          "utf8"
        )
      );
      Object.entries(newRecords).forEach(async ([contractName, records]) => {
        /// SKIP if no records to add
        if (!records.length) {
          console.info(`No new records to add for ${contractName}`);
          return;
        }
        console.info(
          `Adding ${records.length} new records to ${contractName}...`
        );
        /// Get smart contract address from contracts.json
        const contractAddress = contracts[contractName];
        if (!contractAddress) {
          console.error(`Contract address not found for ${contractName}`);
          return;
        }

        /// @dev for now we are adding each record individually
        /// @dev TODO: Add batch insert
        // for (const record of records) {
        await platformWrapper.create(records, contractAddress);
        // }
      });
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
