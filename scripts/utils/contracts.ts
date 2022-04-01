/// @dev Helper functions for updating contracts.json

import { saveToFile } from "./common";
import Contracts from "./contracts.json";
import { resolve } from "path";

const addToContracts = async (contract: any) => {
  let contracts = JSON.stringify({
    ...Contracts,
    ...contract,
  });
  console.log(contracts);

  const contractsPath = resolve(__dirname, "contracts.json");
  await saveToFile(contracts, contractsPath);
};
