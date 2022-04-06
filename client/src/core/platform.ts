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
   * @param contract  Contract address
   */

  create = async (data: Record<string, any>, contract: string) => {
    await this.tezos.contract
      .at(contract) //call the contract to get its entry points
      .then(async (contract) => {
        console.log(
          `List all contract methods: ${Object.keys(contract.methods)}\n`
        );
        console.log(
          `Inspect the signature of the 'create' contract method: ${JSON.stringify(
            contract.methodsObject.create().getSignature(),
            null,
            2
          )}`
        );

        // const storage: any = await contract.storage();

        console.log(data);

        return contract.methodsObject
          .create(data) //call the 'create' entry point
          .send();
      })
      .then(async (op) => {
        console.log(`Awaiting for ${op.hash} to be confirmed...`);
        await op.confirmation();
        return op.hash;
      })
      .then((hash) =>
        console.log(`Operation injected: https://ithaca.tzstats.com/${hash}`)
      )
      .catch((err: any) => console.log(err));
    // const contract2 = await this.tezos.contract.at(contract);
    // const storage: any = await contract2.storage();
    // console.log({ storage: storage.schema.root });
  };
}

export const platformWrapper = new Platform();
