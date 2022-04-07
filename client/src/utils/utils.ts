import { readFileSync } from "fs";
import { resolve } from "path";

export const getRecordsToAddAndUpdate = async (
  records: any,
  backup_file_name: string
) => {
  const recordsToAdd = [];
  const recordsToUpdate = [];

  /// Get new records to add to onchain storage and the records to update
  const Records = JSON.parse(
    readFileSync(resolve(__dirname, `../${backup_file_name}.json`), "utf8")
  );
  for (const record of records) {
    let _record = Records[record.id];
    if (!_record) {
      console.error(`Record not found for ${record.id}`);
      recordsToAdd.push(record);
      continue;
    }

    // check if provider has been updated
    if (record.updated_at !== _record.updated_at) {
      recordsToUpdate.push(record);
    }
  }

  return { recordsToAdd, recordsToUpdate };
};
