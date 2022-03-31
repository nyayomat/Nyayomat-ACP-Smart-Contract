import { schedule } from 'node-cron';
import { databaseWrapper } from './core';

const Main = async () => {
  console.log(`---`.repeat(10));
  console.log(`Starting...`);
  console.log(`---`.repeat(10));

  console.log(`- - -`.repeat(3));
  console.info(`Fetching inventories...`);
  const inventories = await databaseWrapper.fetchInventory();
  console.log({
    inventories,
  });

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
