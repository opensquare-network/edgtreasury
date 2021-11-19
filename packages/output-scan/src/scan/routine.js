const { getScanStep } = require("../env");
const { sleep } = require("../utils/sleep");
const { getLatestHeight } = require("../chain/latestHead");
const { getNextScanHeight } = require("../mongo/scanHeight");

async function beginScan() {
  let scanHeight = await getNextScanHeight();
  while (true) {
    scanHeight = await oneStepScan(scanHeight);
    await sleep(0);
  }
}

async function oneStepScan(startHeight) {
  const chainHeight = getLatestHeight();
  if (startHeight > chainHeight) {
    // Just wait if the to scan height greater than current chain height
    await sleep(3000);
    return startHeight;
  }

  let targetHeight = chainHeight;
  const step = getScanStep();
  if (startHeight + step <= chainHeight) {
    targetHeight = startHeight + step;
  }

  const heights = [];
  for (let i = startHeight; i <= targetHeight; i++) {
    heights.push(i)
  }




}
