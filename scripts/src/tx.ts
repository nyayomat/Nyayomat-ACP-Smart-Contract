import { TezosToolkit } from "@taquito/taquito";
//import inMemorySigner. It will save the private key in the memory and use it to sign transactions
import { InMemorySigner } from "@taquito/signer";
//declare the constant acc directing the script to acc.json
import Account from "./../ithacanet.json";
import { config } from "../config";

class Tx {
  private tezos: TezosToolkit;
  rpcUrl: string;
  constructor() {
    this.rpcUrl = config.TEST_MODE
      ? config.RPC_TESTNET_URL
      : config.RPC_MAINNET_URL;
    this.tezos = new TezosToolkit(this.rpcUrl);

    //declare params with the method fromFundraiser: mail, password, and passphrase that allows one to get the private key
    this.tezos.setSignerProvider(
      InMemorySigner.fromFundraiser(
        Account.email,
        Account.password,
        Account.mnemonic.join(" ")
      )
    );
  }
  //get the public and the private keys and activate the account
  public async activateAccount() {
    const { pkh, activation_code: secret } = Account;
    try {
      const operation = await this.tezos.tz.activate(pkh, secret);
      await operation.confirmation();
    } catch (e) {
      console.log(e);
    }
  }
}

export const txWrapper = new Tx();
