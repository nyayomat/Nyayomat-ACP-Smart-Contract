import { importKey } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { config } from "../config";
import Account from "./../ithacanet.json";
import { readFileSync } from "fs";
import path from "path";

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

  deploy = async (file_name: string, storage: string = `0`) => {
    await importKey(
      this.tezos,
      Account.email, //mail
      Account.password, //password
      Account.mnemonic.join(" "), //passphrase
      Account.activation_code //private key
    );

    try {
      console.log({
        storage,
      });
      const op = await this.tezos.contract.originate({
        //smart contract code
        code: readFileSync(
          path.resolve(__dirname, `../build/${file_name}`),
          "utf8"
        ),
        //storage state
        init: storage,
      });

      //beginning to deploy
      console.log("Awaiting confirmation...");
      const contract = await op.contract();
      //deployment report: amount of used gas, storage state
      console.log("Gas Used", op.consumedGas);
      console.log("Contract Address", contract.address);
      console.log("Storage", await contract.storage());
      //operation hash one can use to find the contract in the explorer
      console.log("Operation hash:", op.hash);
      console.log(`Operation injected: https://ithaca.tzstats.com/${op.hash}`);
    } catch (ex) {
      console.error(ex);
    }
  };

  //declaring the method getBalance with input param address
  getBalance(address?: string): void {
    address = address || Account.pkh;
    console.info(`Getting balance for ${address}...`);
    //Taquito sends a request for balance to the node. If the node executed the request, the script displays the value in the console, otherwise it says “Address not found”
    this.tezos.rpc
      .getBalance(address)
      .then((balance) => console.log(balance.toString()))
      .catch((e) => console.log("Address not found"));
  }
}

export const deployerWrapper = new Deployer();
