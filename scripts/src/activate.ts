import { txWrapper } from "./tx";

const Main = async () => {
  console.info(`- - - -`.repeat(10));
  console.info(`Activating...`);
  console.info(`- - - -`.repeat(10));

  //call the function Tx, send it the testnet link, and ask to activate the account
  await txWrapper.activateAccount();
};

Main();
