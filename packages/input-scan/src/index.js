const { beginScan } = require("./scan/routine");
const { updateSpecs } = require("./chain/specs");
const { subscribeChainHeight } = require("./chain/latestHead");

async function main() {
  await subscribeChainHeight();
  await updateSpecs();

  await beginScan();
}

main()
  .catch(console.error);
