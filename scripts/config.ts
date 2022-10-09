import "dotenv/config";

export const config = {
  // The public node address of the Tezos network
  TEST_MODE: process.env.TEST_MODE === "true",
  //   TEST_MODE: false,

  RPC_TESTNET_URL: `https://rpc.tzkt.io/ithacanet`,
  RPC_MAINNET_URL: "https://mainnet.smartpy.io/",

  PUBLIC_KEY: process.env.PUBLIC_KEY!,

  PRIVATE_KEY: process.env.PRIVATE_KEY!,
};
