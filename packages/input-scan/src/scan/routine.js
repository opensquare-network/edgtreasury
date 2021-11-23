const { handleSpecialBlock } = require("./block");
const { specialHeights } = require("./specialHeights");
const { getMetaScanHeight } = require("../chain/specs");
const { updateSpecs } = require("../chain/specs");
const { logger } = require("../logger");
const { tryCreateStatPoint } = require("./stats");
const { getHeadUsedInGB } = require("../utils/memory");
const { getBlockIndexer } = require("../business/common/block/getBlockIndexer");
const { updateScanStatus } = require("../mongo/scanHeight");
const { scanNormalizedBlock } = require("./block");
const { fetchBlocks } = require("./fetchBlock");
const { getScanStep, isUseMetaDb } = require("../env");
const { getLatestHeight } = require("../chain/latestHead");
const { sleep } = require("../utils/sleep");
const { getApi } = require("../chain/api");
const { getNextScanHeight } = require("../mongo/scanHeight");

async function beginScan() {
  let scanHeight = await getNextScanHeight();
  while (true) {
    const api = await getApi();
    if (!api.isConnected) {
      console.log("Api not connected, restart process");
      process.exit(0);
    }

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
  if (startHeight + step < chainHeight) {
    targetHeight = startHeight + step;
  }

  if (isUseMetaDb()) {
    if (targetHeight > getMetaScanHeight()) {
      await updateSpecs();
    }
  }

  const heights = [];
  for (let i = startHeight; i <= targetHeight; i++) {
    heights.push(i)
  }
  const blocks = await fetchBlocks(heights);
  if ((blocks || []).length <= 0) {
    await sleep(1000);
    return startHeight;
  }

  for (const block of blocks) {
    // TODO: do following operations in one transaction
    try {
      let seats;
      if (specialHeights.includes(block.height)) {
        seats = await handleSpecialBlock(block.height);
      } else {
        const indexer = getBlockIndexer(block.block);
        seats = await scanNormalizedBlock(block.block, block.events, indexer);
      }

      await updateScanStatus(block.height, seats);
      await tryCreateStatPoint(indexer);
    } catch (e) {
      await sleep(1000);
      logger.error(`Error with block scan ${block.height}`, e);
    } finally {
      if (getHeadUsedInGB() > 1) {
        console.log(
          `${getHeadUsedInGB()}GB heap used, restart process in case of memory leak`
        );
        process.exit(0);
      }
    }
  }
}

module.exports = {
  beginScan,
}
