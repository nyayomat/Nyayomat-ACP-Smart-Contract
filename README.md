# Nyayomat ACP

**Project Overview**

.
├── client
├── contracts
├── LICENSE
├── README.md
├── scripts

client - An interface that contains adapters for fetching data from Nyayomant DB and pushing it to Onchain Marketplace

contracts - The marketplace smart contracts

scripts - The deployment scripts to tezos testnet and mainnet i.e [ithacanet](https://ithacanet.tzkt.io/), [mainnet](https://tzkt.io/), [hangzhounet](https://hangzhounet.tzkt.io/)

README.md - This readme :)

LICENCE - Licence **T& C** for use and distribution of this s/w

#### Contracts

Contains the marketplace smart contracts as shown below

```
contracts
└── modules
    ├── asset.religo
    ├── order.religo
    ├── provider.religo
    ├── transaction.religo
    └── user.religo

1 directory, 5 files
```

#### Scripts

The deployment scripts to tezos testnet and mainnet i.e [ithacanet](https://ithacanet.tzkt.io/), [mainnet](https://tzkt.io/), [hangzhounet](https://hangzhounet.tzkt.io/)

On the scripts folder there are a few things to configure.

1. You have to rename/or copy `ithacanet.example.json` to `ithacanet.json`

2. Once done you have to populate the values in the `ithacanet.json` file to be of that of your real account.

You can easily create an account for tezos testnet by following this guide, the process usually takes a few minutes to get a test account with funds/faucets for testing.

[Teztnets Guide](https://teztnets.xyz/ithacanet-faucet)

3. Once you have downloaded your `ithacanet.json` you can open it and copy all the contents there to the file that you created at step 1.

4. Once done you are now ready to install dependencies and deploy your s.c

#### Installation && Deployment

Install the project dependencies by running the following commands:

1. Change directory to scripts folder

   ```
   cd scripts
   ```

2. Install yarn dependencies

   ```
   yarn install
   ```

3. Deploy the smart contracts to the testnet by running the following command:

   ```
   yarn deploy:testnet
   ```

   This will deploy the smart contracts to the testnet, and copy the new contract addresses to the `scripts/utils/contracts.json` file.

4. And that's it on the scripts folder. You only only have to deploy the smart contracts once and client bot will be able to push data to each of the deployed smart contract.

#### Client

Contains adapters for fetching data from Nyayomant DB, parsing in a format that is expected in the smart contracts and pushing it to onchain smart contracts on Tezos blockchain.
