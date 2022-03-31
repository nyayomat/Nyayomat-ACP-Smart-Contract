import { schedule } from 'node-cron';
import { mapInventoryToTezos, mapInvoiceToTezos } from './common';
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
  const invoicesDB = await databaseWrapper.fetchTable('invoices');
  console.log({
    invoicesDB,
  });
  console.log(mapInvoiceToTezos(invoicesDB));
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
