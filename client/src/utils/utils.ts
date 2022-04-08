import { readFileSync } from "fs";
import { resolve } from "path";

export const getRecordsToAddAndUpdate = async (
  records: any[],
  backup_file_name: string
) => {
  const create = [];
  const update = [];

  let Records: any = {};
  try {
    /// Get new records to add to onchain storage and the records to update
    Records = JSON.parse(
      readFileSync(
        resolve(__dirname, `../../backups/${backup_file_name}.json`),
        "utf8"
      )
    );
  } catch (e) {
    // console.error(e);
  }

  /// @dev Filter out records with no ids
  records = records.filter((record) => record.id);
  for (const record of records) {
    let _record = Records[record.id];
    if (!_record) {
      //   console.error(`Record not found for ${record.id}`);
      create.push(record);
      continue;
    }

    // check if provider has been updated
    if (
      new Date(record.updated_at).getTime() !==
      new Date(_record.updated_at).getTime()
    ) {
      update.push(record);
    }
  }

  return { create, update, records };
};

export const chunk = <T>(arr: T[], size: number): T[][] =>
  [...Array(Math.ceil(arr.length / size))].map((_, i) =>
    arr.slice(size * i, size + size * i)
  );
