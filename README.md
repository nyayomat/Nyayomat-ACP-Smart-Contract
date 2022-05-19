# Nyayomat ACP

**Project Overview**

```
.
├── client
├── contracts
├── LICENSE
├── README.md
├── scripts
├── tests
```

#### **Prerequisites**

There are the required prerequisites to run the project.

1. Ensure you have Node.js installed.

If not, you can install it with the following command according to [this guide](https://github.com/nvm-sh/nvm)

```
 curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Reload your terminal and run the following command to install the latest version of Node.js:

```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

Install the latest version of Node.js with the following command:

```
nvm install 16 # This installs Node.js 16

nvm use 16 # This sets the Node.js version to 16
```

2. After you have NodeJS installed you need to install Yarn. This the package manager for Node.js that I will be using.

   ```
   npm install -g yarn
   ```

3. Once you have Yarn you can clone the project with the following command:

   ```
   git clone git@github.com-work:devNgeni/nyayomat.git
   ```

   This will clone the project to the current directory to a new folder called `nyayomat`.

You will need to change directory to the `nyayomat` folder and run the following command to install the dependencies:

```
cd nyayomat

yarn install
```

This will install all the dependencies needed to run the project.

4. Ensure ligo is installed
   To install ligo, **[follow this guide](https://ligolang.org/docs/intro/installation)** from their official documentation.

#### **Contracts**

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

#### **Scripts**

The deployment scripts to tezos testnet and mainnet i.e [ithacanet](https://ithacanet.tzkt.io/), [mainnet](https://tzkt.io/), [hangzhounet](https://hangzhounet.tzkt.io/)

On the scripts folder there are a few things to configure.

1. You have to rename/or copy `ithacanet.example.json` to `ithacanet.json`
2. Once done you have to populate the values in the `ithacanet.json` file to be of that of your real account.

You can easily create an account for tezos testnet by following this guide, the process usually takes a few minutes to get a test account with funds/faucets for testing.

[Teztnets Guide](https://teztnets.xyz/ithacanet-faucet)

3. Once you have downloaded your `ithacanet.json` you can open it and copy all the contents there to the file that you created at step 1.
4. Activate your account. Note that is only one time, and you will need to have installed project dependencies according to the [prerequisites](#prerequisites).

   ```
   yarn activate:account
   ```

5. Once done you are now ready to install dependencies and deploy your s.c

#### **Installation && Deployment**

0. Ensure you have dependencies according to the [prerequisites](#prerequisites) before you continue.
1. Deploy the smart contracts to the testnet by running the following command:

   ```
   yarn deploy:testnet
   ```

   This will deploy the smart contracts to the testnet, and copy the new contract addresses to the `scripts/utils/contracts.json` file.

2. And that's it on the scripts folder. You only only have to deploy the smart contracts once and client bot will be able to push data to each of the deployed smart contracts.

#### **Client**

Contains adapters for fetching data from Nyayomat DB, parsing it in a format that is expected in the smart contracts and pushing it to onchain smart contracts on Tezos blockchain.

On the client folder there are a few things to configure.

1. Ensure you have backups folder. If it doesn't exist, create it. It is used to store the backups of the smart contracts. This necessary to speed up the process of backing up data, as it acts as an intermediate step that is crucial for checking what has changed or new new and to be backed up.
2. Rename/or copy `.env.example` to `.env`

   ```
   cp .env.example .env
   ```

3. Once done you have to populate the values in the `.env` file to be of that of your database in production
4. Open config.ts and set your preferred backup time. Note the format of the time is `HH:MM`
5. Ensure you have dependencies installed. as required by the [prerequisites](#prerequisites)

and then run the following command to start the client bot:

```yarn start```

#### **Test**

Contains smart contracts test written in `religo`.

##### How to run the tests

1. Navigate into the scripts folder

   ```
   cd scripts
   ```

2. Once there run the following command

   ```
   yarn test:ligo
   ```

      Your tests should run succesfully
