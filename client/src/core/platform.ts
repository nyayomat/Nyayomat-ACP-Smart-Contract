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

  create = async (data: any, contract: string, action: string) => {
    this.tezos.contract
      .at(contract) //call the contract to get its entry points
      .then((contract) => {
        console.log(
          `List all contract methods: ${Object.keys(contract.methods)}\n`
        );
        console.log(
          `Inspect the signature of the 'createAsset' contract method: ${JSON.stringify(
            contract.methodsObject.createAsset().getSignature(),
            null,
            2
          )}`
        );

        return contract.methodsObject
          .createAsset({
            categoryId: "0",
            createdAt: new Date().getTime().toString(),
            deletedAt: new Date().getTime().toString(),
            depositAmount: 0,
            groupId: "9",
            holidayProvision: 30,
            id: "1232",
            image: "strinew2ew2eg",
            installment: 900,
            name: "stringdwdw",
            owner: "string24324",
            paymentFreq: "string321313",
            paymentMethod: "stringr3rr",
            providerId: "string24324",
            status: "stringe2e2",
            subGroupId: "243",
            totalOutStandingAmount: 40,
            unitCost: 90,
            units: 2,
            updatedAt: new Date().getTime().toString(),
          })
          .send();
      })
      .then((op) => {
        console.log(`Awaiting for ${op.hash} to be confirmed...`);
        return op.confirmation().then(() => op.hash);
      })
      .then((hash) =>
        console.log(`Operation injected: https://ithaca.tzstats.com/${hash}`)
      )
      .catch((err: any) => console.log(err));
  };
}

export const platformWrapper = new Platform();
