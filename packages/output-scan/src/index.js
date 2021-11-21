require("dotenv").config();

const { beginScan } = require("./scan/routine");
const { subscribeChainHeight } = require("./chain/latestHead");

async function main() {
  await subscribeChainHeight();

  await beginScan();
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
