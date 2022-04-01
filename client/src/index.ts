import { schedule } from 'node-cron';
import {
  mapInventoryToTezos,
  mapInvoiceToTezos,
  mapProductToTezos,
  mapAssetToTezos,
  mapUserToTezos,
  mapTransactionToTezos,
} from './common';
import { databaseWrapper } from './core';
import { InventoryDB } from './types';

const Main = async () => {
  console.log(`---`.repeat(10));
  console.log(`Starting...`);
  console.log(`---`.repeat(10));

  console.log(`- - -`.repeat(3));
  console.info(`Fetching inventories...`);
  // const inventoriesDB = await databaseWrapper.fetchTable('inventories');
  // console.log(mapInventoryToTezos(inventoriesDB));
  // const invoicesDB = await databaseWrapper.fetchTable('invoices');
  // console.log(mapInvoiceToTezos(invoicesDB));

  // const productsDB = await databaseWrapper.fetchTable('assets');
  // console.log(mapProductToTezos(productsDB));
  // const assetsDB = await databaseWrapper.fetchTable('tbl_acp_assets');
  // console.log(mapAssetToTezos(assetsDB));

  // const usersDB = await databaseWrapper.fetchTable('users');
  // console.log(mapUserToTezos(usersDB));

  const providerTxDB = await databaseWrapper.fetchTable(
    'tbl_acp_asset_provider_transaction'
  );
  console.log(mapTransactionToTezos(providerTxDB));
  // const merchantTxDB = await databaseWrapper.fetchTable(
  //   'tbl_acp_merchant_transaction'
  // );
  // console.log(mapTransactionToTezos(merchantTxDB));
  console.log(`- - -`.repeat(3));
  console.info(`Scheduling...`);
  /// @dev Run task every day at midnight
  schedule(
    '0 0 * * *',
    async () => {
      console.log('Running task every day at midnight');
    },
    {
      scheduled: true,
      timeZone: 'Africa/Nairobi',
    }
  );
  console.log(`---`.repeat(3));
  console.info(`Done. ✔️`);
};

Main();
