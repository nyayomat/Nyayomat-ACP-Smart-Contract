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


      /// STEP 2:
      /// Get Inventories to add or update
      const {
        recordsToAdd: inventoriesToAdd,
        recordsToUpdate: inventoriesToUpdate,
      } = await getRecordsToAddAndUpdate(inventoriesDB, "inventory");

      /// Get Products to add or update
      const { recordsToAdd: productsToAdd, recordsToUpdate: productsToUpdate } =
        await getRecordsToAddAndUpdate(productsDB, "product");

      /// Get Invoices to add or update
      const { recordsToAdd: invoicesToAdd, recordsToUpdate: invoicesToUpdate } =
        await getRecordsToAddAndUpdate(invoicesDB, "invoice");

      /// Get Assets to add or update
      const { recordsToAdd: assetsToAdd, recordsToUpdate: assetsToUpdate } =
        await getRecordsToAddAndUpdate(assetsDB, "asset");

      /// Get Users to add or update
      const { recordsToAdd: usersToAdd, recordsToUpdate: usersToUpdate } =
        await getRecordsToAddAndUpdate(usersDB, "user");

      /// Get Provider Transactions to add or update
      const {
        recordsToAdd: providerTxToAdd,
        recordsToUpdate: providerTxToUpdate,
      } = await getRecordsToAddAndUpdate(providerTxDB, "providerTx");

      /// Get Merchant Transactions to add or update
      const {
        recordsToAdd: merchantTxToAdd,
        recordsToUpdate: merchantTxToUpdate,
      } = await getRecordsToAddAndUpdate(merchantTxDB, "merchantTx");

      /// Get Providers to add or update
      const {
        recordsToAdd: providersToAdd,
        recordsToUpdate: providersToUpdate,
      } = await getRecordsToAddAndUpdate(providersDB, "provider");


      // DB records expected types
         // [
         //     {
         //       data: {
         //       update: [],
         //       create: [],
         //       contract: 'string'
         //    },}
         //  ]
      const {recordsToAdd: create, recordsToUpdate: update} = await getRecordsToAddAndUpdate(dbName, `${backup_file_name}`);
    
   const db_records: any [] = [
     {
       data: {
         create,
         update
       }
     }
   ]

      const records: {
        data: any[];
        contract: string;
      }[] = db_records.map((record) => {

        let data: any[] = [];
        switch (record.data.contract) {
          case 'provider':
            data = [mapProviderToTezos(record, "create"),
                mapProviderToTezos(record, "update")]
            break;
            case 'inventory':
              data = [mapInventoryToTezos(record, "create"),
                  mapInventoryToTezos(record, "update")]
              break;
            case 'invoice':
              data = [mapInvoiceToTezos(record, "create"),
                  mapInvoiceToTezos(record, "update")]
              break;
            case 'product':
              data = [mapProductToTezos(record, "create"),
                  mapProductToTezos(record, "update")]
              break;
            case 'asset':
              data = [mapAssetToTezos(record, "create"),
                  mapAssetToTezos(record, "update")]
              break;
              case 'user':
                data = [mapUserToTezos(record, "create"),
                    mapUserToTezos(record, "update")]
                break;
            case 'transaction':
              data = [mapTransactionToTezos(record, "create"),
                  mapTransactionToTezos(record, "update")]
                break;
      
          default:
            break;
        }
        return {
          data,
          contract: record.contract,
        }
      }
        
      /// Get Contract addresses from contracts.json
      const contracts = JSON.parse(
        readFileSync(
          resolve(__dirname, "../../scripts/utils/contracts.json"),
          "utf8"
        )
      );

      /// @dev Add or update providers in onchain storage
      records.forEach(async (record) => {
        if (record.action === "create") {
          /// SKIP if no records to add
          if (!record.data.length) {
            console.info(`No new records to add for ${record.contract}`);
            return;
          }

          console.info(
            `Adding ${record.data.length} new records to ${record.contract}...`
          );
          /// Get smart contract address from contracts.json
          const contractAddress = contracts[record.contract];
          if (!contractAddress) {
            console.error(`Contract address not found for ${record.contract}`);
            return;
          }
          /// @dev Add batch insert
          await platformWrapper.create(record.data, contractAddress);

          /// TODO update backups refs after an update
        } else if (record.action === "update") {
          /// SKIP if no records to add
          if (!record.data.length) {
            console.info(`No records to update for ${record.contract}`);
            return;
          }

          console.info(
            `Updating ${record.data.length} records in ${record.contract}...`
          );
          /// Get smart contract address from contracts.json
          const contractAddress = contracts[record.contract];
          if (!contractAddress) {
            console.error(`Contract address not found for ${record.contract}`);
            return;
          }
          /// @dev batch update
          await platformWrapper.update(record.data, contractAddress);
          /// TODO update backups refs after an update
        } else {
          console.warn(
            `Unsupported action ${record.action} for ${record.contract}`
          );
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
