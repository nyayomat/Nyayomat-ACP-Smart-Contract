import { readdirSync } from "fs";
import { resolve } from "path";
import { compileAndSaveBuild } from "../utils";

const Main = async () => {
  console.log("---".repeat(10));
  console.info("Compiling Modules...");
  console.log("---".repeat(10));

  const modulesPath = "../../src/modules";
  const outPath = "../build";
  const modules = readdirSync(resolve(__dirname, modulesPath));

  /// @dev Write the compiled module to scripts/modules
  for (const module of modules) {
    console.info(`Compiling module ${module}...`);
    const file_name = module.split(".")[0];
    await compileAndSaveBuild(
      resolve(resolve(__dirname, modulesPath), `${module}`),
      resolve(resolve(__dirname, outPath), `${file_name}.tz`)
    );
    console.log(`---`.repeat(10));
  }

  const storagesPath = "../../src/storages";
  const storages = readdirSync(resolve(__dirname, storagesPath));

  /// @dev Write the compiled module to scripts/modules
  for (const storage of storages) {
    console.info(`Compiling storage ${storage}...`);
    const file_name = storage.split(".")[0];
    await compileAndSaveBuild(
      resolve(resolve(__dirname, storagesPath), `${storage}`),
      resolve(resolve(__dirname, outPath), `${file_name}_storage.tz`),
      true
    );
    console.log(`---`.repeat(10));
  }
};

Main();
