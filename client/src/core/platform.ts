import { TezosToolkit, MichelsonMap } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import Account from "../../ithacanet.json";
import { config } from "../../config";

/**
 * Platform Wrapper that contains functionaloties for interacting with the nyayomat smart contracts
 * @dev Platform is Nyayomat
 */
class Platform {
  private tezos: TezosToolkit;
  rpcUrl: string;

  constructor() {
    this.rpcUrl = config.TEST_MODE
      ? config.RPC_TESTNET_URL
      : config.RPC_MAINNET_URL;
    this.tezos = new TezosToolkit(this.rpcUrl);

    //declaring the parameters using fromFundraiser: mail, password, and passphrase from which one can extract the private key
    this.tezos.setSignerProvider(
      InMemorySigner.fromFundraiser(
        Account.email,
        Account.password,
        Account.mnemonic.join(" ")
      )
    );
  }

  /**
   * Generic function for adding a new entry into the smart contract
   *
   * @param data  Data to be added to the smart contract
   * @param contractAddress  Contract address
   */

  create = async (data: Record<string, any>[], contractAddress: string) => {
    try {
      const contract = await this.tezos.contract.at(contractAddress);
      console.log(
        `Inspect the signature of the 'create' contract method: ${JSON.stringify(
          contract.methodsObject.create().getSignature(),
          null,
          2
        )}`
      );

      const op = await contract.methodsObject.update(data).send();
      console.log(`Awaiting for ${op.hash} to be confirmed...`);
      await op.confirmation(3);
      console.log(`Operation injected: https://ithaca.tzstats.com/${op.hash}`);
      return op.hash;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  /**
   * Generic function for updating an existing record in the smart contract
   *
   * @param data  Data to be updated in the smart contract
   * @param contractAddress  Contract address
   *
   * returns the hash of the operation
   */

  update = async (data: Record<string, any>[], contractAddress: string) => {
    try {
      const contract = await this.tezos.contract.at(contractAddress);

      const op = await contract.methodsObject.update(data).send();

      console.log(`Awaiting for ${op.hash} to be confirmed...`);
      await op.confirmation(3);
      console.log(`Operation injected: https://ithaca.tzstats.com/${op.hash}`);
      return op.hash;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export const platformWrapper = new Platform();
