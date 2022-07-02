import { exec } from "child_process";
import { writeFileSync } from "fs";
import Account from "../ithacanet.json";

export const compileAndSaveBuild = async (
  modulePath: string,
  outPath: string,
  storage: boolean = false
) => {
  exec(
    storage
      ? `ligo compile expression reasonligo --init-file ${modulePath} storage`
      : `ligo compile contract ${modulePath} --entry-point main`,
    (err: any, stdout: any, stderr: any) => {
      if (err) {
        //some err occurred
        console.error(err);
      } else {
        if (stdout) {
          /// @dev Replace all hardcoded owner addresses with the actual owner addresses
          stdout = stdout.replace(/"tz1[a-zA-Z0-9]{33}"/g, `"${Account.pkh}"`);
          writeFileSync(outPath, stdout);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
        }
      }
    }
  );
};
