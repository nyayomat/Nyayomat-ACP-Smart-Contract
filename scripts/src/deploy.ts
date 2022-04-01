import { importKey } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { config } from "../config";
import Account from "./../ithacanet.json";
import { readFileSync } from "fs";
import path from "path";

import Contracts from "../../scripts/utils/contracts.json";
import { resolve } from "path";

import { saveToFile } from "../utils/common";

class Deployer {
  //declaring private tezos modifier of TezosToolkit type
  private tezos: TezosToolkit;

  constructor() {
    //declaring the constructor rpcUrl that will broadcast the Tezos public node address to TezosToolkit
    let rpcUrl = config.TEST_MODE
      ? config.RPC_TESTNET_URL
      : config.RPC_MAINNET_URL;
    this.tezos = new TezosToolkit(rpcUrl);
  }

  deploy = async (contract_name: string) => {
    await importKey(
      this.tezos,
      Account.email, //mail
      Account.password, //password
      Account.mnemonic.join(" "), //passphrase
      Account.activation_code //private key
    );

    try {
      const op = await this.tezos.contract.originate({
        //smart contract code
        code: readFileSync(
          path.resolve(__dirname, `../build/${contract_name}.tz`),
          "utf8"
        ),
        //storage state
        init: readFileSync(
          path.resolve(__dirname, `../build/${contract_name}_storage.tz`),
          "utf8"
        ),
      });

      //beginning to deploy
      console.log("Awaiting confirmation...");
      const contract = await op.contract();
      //deployment report: amount of used gas, storage state
      console.log("Gas Used", op.consumedGas);
      console.log("Contract Address", contract.address);
      // console.log("Storage", await contract.storage());
      //operation hash one can use to find the contract in the explorer
      console.log("Operation hash:", op.hash);
      console.log(`Operation injected: https://ithaca.tzstats.com/${op.hash}`);
      /// @dev save address to contracts.json
      // console.log(typeof addToContracts);
      // addToContracts(
      //   JSON.parse(
      //     JSON.stringify(`{
      //   ${contract_name}: contract.address,
      // }`)
      //   )
      // );

      let contracts = JSON.stringify({
        ...Contracts,
        ...JSON.parse(
          JSON.stringify(`{
        ${contract_name}: contract.address,
      }`)
        ),
      });

      const contractsPath = resolve(__dirname, "contracts.json");
      await saveToFile(contracts, contractsPath);
    } catch (ex) {
      console.error(ex);
    }
  };

  //declaring the method getBalance with input param address
  getBalance = async (address?: string) => {
    address = address || Account.pkh;
    console.info(`Getting balance for ${address}...`);
    //Taquito sends a request for balance to the node. If the node executed the request, the script displays the value in the console, otherwise it says “Address not found”
    await this.tezos.rpc
      .getBalance(address)
      .then((balance) =>
        console.log(`Balance:`, balance.shiftedBy(-6).toString())
      )
      .catch((e) => console.log("Address not found"));
  };
}

export const deployerWrapper = new Deployer();
