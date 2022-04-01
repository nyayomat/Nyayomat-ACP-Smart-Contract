import { deployerWrapper } from "./deploy";

const Main = async () => {
  console.info(`- - - -`.repeat(10));
  console.info(`Starting...`);
  console.info(`- - - -`.repeat(10));

  await deployerWrapper.getBalance();
  console.info(`- - - -`.repeat(10));
  let contract_name = "transaction";
  console.info(`Deploying contract ${contract_name}...`);
  deployerWrapper.deploy(contract_name);
  console.info(`- - - -`.repeat(10));
};

Main();
