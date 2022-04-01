import { TezosToolkit } from "@taquito/taquito";
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
   * @param contract  Contract address
   */

  create = async (data: any, contract: string, action: string) => {
    this.tezos.contract
      .at(contract) //call the contract to get its entry points
      .then((contract) => {
        // console.log(`Adding ${data} to storage...`);
        // //calling the create function
        // return contract.methods.default(data).send();
        let methods = contract.parameterSchema.ExtractSignatures();
        console.log(JSON.stringify(methods, null, 2));
      })
      // .then(async (op) => {
      //   console.log(`Awaiting for ${op.hash} to be confirmed...`);
      //   await op.confirmation(1);
      //   return op.hash; //waiting for 1 confirmation to get the results faster
      // })
      .then((hash) => console.log(`Call done}`)) //call is successful
      .catch((error) =>
        console.log(`Error: ${JSON.stringify(error, null, 2)}`)
      );
  };
}

export const platformWrapper = new Platform();
