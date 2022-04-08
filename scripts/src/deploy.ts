import { importKey } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { config } from "../config";
import Account from "./../ithacanet.json";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, join } from "path";

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
      let code = readFileSync(
        resolve(__dirname, `../build/${contract_name}.tz`),
        "utf8"
      );
      /// @dev Replace all hardcoded owner addresses with the actual owner addresses
      code = code.replace(/"tz1[a-zA-Z0-9]{33}"/g, `"${Account.pkh}"`);
      const op = await this.tezos.contract.originate({
        //smart contract code
        code,
        //storage state
        init: readFileSync(
          resolve(__dirname, `../build/${contract_name}_storage.tz`),
          "utf8"
        ),
      });

      const contract = await op.contract(1);
      //deployment report: amount of used gas, storage state
      console.log("Gas Used", op.consumedGas);
      console.info(`---`);
      console.log("Contract Address", contract.address);
      //operation hash one can use to find the contract in the explorer
      console.info(`---`);
      console.log(`Operation injected: https://ithacanet.tzkt.io/${op.hash}`);

      /// @dev save address to contracts.json
      let contracts = {
        ...JSON.parse(
          readFileSync(join(__dirname, "../utils/contracts.json"), "utf8")
        ),
        [contract_name]: contract.address,
      };

      writeFileSync(
        join(__dirname, "../utils/contracts.json"),
        JSON.stringify(contracts, null, 2)
      );
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
        console.log(`\nBalance:`, balance.shiftedBy(-6).toString())
      )
      .catch((e) => console.log("Address not found"));
  };
}

const Main = async () => {
  console.info(`- - - -`.repeat(10));
  console.info(`Starting...`);
  console.info(`- - - -`.repeat(10));

  const deployerWrapper = new Deployer();

  await deployerWrapper.getBalance();
  console.info(`- - - -`.repeat(10));
  let contracts = readdirSync(resolve(__dirname, `../build`), "utf8");

  // filter out non-contract files
  contracts = contracts.filter((contract) => !contract.endsWith("_storage.tz"));

  /// Exclude contracts that are already deployed ?
  // contracts = contracts.filter((contract) => !Contracts[contract.split(".")[0]]);

  /// Filter out some contracts
  // contracts = contracts.filter(
  //   (contract) => !["invoice.tz", "inventory.tz", "order.tz"].includes(contract)
  // );

  // /// Deploy specific contracts
  // contracts = contracts.filter((contract) =>
  //   ["inventory.tz"].includes(contract)
  // );

  // console.log({
  //   contracts,
  // });
  const count = contracts.length;

  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];
    const contract_name = contract.split(".")[0];
    console.info(`${i + 1}/${count}.Deploying ${contract_name} contract...`);
    await deployerWrapper.deploy(contract_name);
    console.info(`- - - -`.repeat(3));
  }
};

Main();
