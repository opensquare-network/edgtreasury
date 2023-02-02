require("dotenv").config();

const { beginScan } = require("./scan/routine");
const {
  chain: { subscribeChainHeight, updateSpecs, checkSpecs },
  env: { isUseMetaDb },
} = require("@osn/scan-common");

async function main() {
  await subscribeChainHeight();
  if (isUseMetaDb()) {
    await updateSpecs();
    checkSpecs();
  }

  await beginScan();
}

main()
  .catch(console.error);
