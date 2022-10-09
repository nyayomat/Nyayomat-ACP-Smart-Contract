import { exec } from "child_process";

const contracts = ["asset", "order", "provider", "transaction", "user"];

contracts.forEach((contract) => {
  exec(`ligo run test ../test/${contract}.religo `, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }

    console.log("------".repeat(20));
    console.log(`\tRUNNING TESTS FOR CONTRACT {${contract}}`);
    console.log("------".repeat(20));
    console.log(`stdout: ${stdout} \n \n`);
  });
});
