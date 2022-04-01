import { deployerWrapper } from "./deploy";

const Main = async () => {
  console.info(`- - - -`.repeat(10));
  console.info(`Starting...`);
  console.info(`- - - -`.repeat(10));

  console.info(`- - - -`.repeat(10));
  let contract_file_name = "transactions.tz";
  let storage =
    '{ Elt "98" (Pair (Pair (Pair (Pair 130 "19") "" "1645345483000") (Pair "1645822800000" "98") "Merchant" "3") (Pair "12" "") "installment" "1645345483000") }';
  console.info(`Deploying contract ${contract_file_name}...`);
  deployerWrapper.getBalance();
  deployerWrapper.deploy(contract_file_name, storage.toString());
  console.info(`- - - -`.repeat(10));
};

Main();
