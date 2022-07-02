import "dotenv/config";

export const config = {
  /**
   *  Database Config
   */
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_NAME: process.env.DB_NAME!,
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",

  /**
   * S.C Config
   * @dev S.C is the smart contract
   */
  // The public node address of the Tezos network
  TEST_MODE: process.env.TEST_MODE === "true",
  // TEST_MODE: false,

  RPC_TESTNET_URL: `https://rpc.tzkt.io/ithacanet`,
  RPC_MAINNET_URL: "https://mainnet.smartpy.io/",

  /*
   * Backup Time Config
   * @example
   * BACKUP_TIME: "19:40"
   */
  BACKUP_TIME: "17:38",

  /**
   * TEZOS Account Config
   */
  PRIVATE_KEY: process.env.PRIVATE_KEY!,
  PUBLIC_KEY: process.env.PUBLIC_KEY!,
};
