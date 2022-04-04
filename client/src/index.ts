import { schedule } from "node-cron";
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
import { InventoryDB } from "./types";

const Main = async () => {
  console.log(`---`.repeat(10));
  console.log(`Starting...`);
  console.log(`---`.repeat(10));

  console.log(`- - -`.repeat(3));
  console.info(`Fetching providers...`);
  // const inventoriesDB = await databaseWrapper.fetchTable('inventories');
  // console.log(mapInventoryToTezos(inventoriesDB));
  // const invoicesDB = await databaseWrapper.fetchTable('invoices');
  // console.log(mapInvoiceToTezos(invoicesDB));

  // const productsDB = await databaseWrapper.fetchTable('assets');
  // console.log(mapProductToTezos(productsDB));
  const assetsDB = await databaseWrapper.fetchTable("tbl_acp_assets");
  console.log(mapAssetToTezos(assetsDB));

  // const usersDB = await databaseWrapper.fetchTable('users');
  // console.log(mapUserToTezos(usersDB));

  // const providerTxDB = await databaseWrapper.fetchTable(
  //   'tbl_acp_asset_provider_transaction'
  // );
  // console.log(mapTransactionToTezos(providerTxDB));
  // const merchantTxDB = await databaseWrapper.fetchTable(
  //   "tbl_acp_merchant_transaction"
  // );
  // console.log(mapTransactionToTezos(merchantTxDB));
  // const productsDB = await databaseWrapper.fetchTable('products');

  // console.log(mapProductToTezos(productsDB));

  // const providersDB = await databaseWrapper.fetchTable(
  //   "tbl_acp_asset_providers"
  // );

  // console.log({
  //   providersDB,
  // });
  const assets = mapAssetToTezos(assetsDB);
  console.log({
    assets,
  });
  console.log(`- - -`.repeat(3));

  console.log(assets[assets.length - 1]);
  await platformWrapper.create(
    assets[assets.length - 1],
    "KT1XHv7tGmjUY3VENQnL1LH8t8MgengysHMP",
    "Create"
  );
  console.info(`Scheduling...`);
  /// @dev Run task every day at midnight
  schedule(
    "0 0 * * *",
    async () => {
      console.log("Running task every day at midnight");
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
