import { deployerWrapper } from "./deploy";
import { readdirSync, writeFileSync } from "fs";
import { resolve } from "path";

const Main = async () => {
  console.info(`- - - -`.repeat(10));
  console.info(`Starting...`);
  console.info(`- - - -`.repeat(10));

  await deployerWrapper.getBalance();
  console.info(`- - - -`.repeat(10));
  const contracts = readdirSync(resolve(__dirname, `../build`), "utf8");

  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];
    const contract_name = contract.split(".")[0];
    console.info(`${i + 1}.Deploying contract ${contract_name}...`);
    await deployerWrapper.deploy(contract_name);
    console.info(`- - - -`.repeat(10));
  }
};

Main();
