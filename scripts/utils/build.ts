import { exec } from "child_process";
import { saveToFile } from "./common";

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
          saveToFile(stdout, outPath);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
        }
      }
    }
  );
};
