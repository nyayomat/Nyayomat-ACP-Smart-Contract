import { exec } from "child_process";
import { writeFileSync } from "fs";

export const compileAndSaveBuild = async (
  modulePath: string,
  outPath: string
) => {
  exec(
    `ligo compile contract ${modulePath} --entry-point main`,
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

const saveToFile = async (content: string, file: string) => {
  writeFileSync(file, content);
};
