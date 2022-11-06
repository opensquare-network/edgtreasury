const { scanNormalizedBlock } = require("./block");
const { updateScanHeight } = require("../mongo/scanHeight");
const { fetchBlocks } = require("./fetchBlock");
const { sleep } = require("../utils/sleep");
const { getLatestHeight } = require("../chain/latestHead");
const { getNextScanHeight } = require("../mongo/scanHeight");
const last = require("lodash.last");
const { scanKnownHeights } = require("./known");
const { firstScanKnowHeights, isUseMetaDb, getScanStep } = require("../env");
const { negligibleHeights } = require("./ignoredHeights");
const { getHeadUsedInGB } = require("../utils/memory");
const { updateSpecs, getMetaScanHeight } = require("../chain/specs");
const { logger } = require("../logger");

async function beginScan() {
  await updateSpecs();

  if (firstScanKnowHeights()) {
    await scanKnownHeights()
  }

  let scanHeight = await getNextScanHeight();
  while (true) {
    scanHeight = await oneStepScan(scanHeight);
    await sleep(0);
  }
}

async function oneStepScan(startHeight) {
  const chainHeight = getLatestHeight() - 100;
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

  if (isUseMetaDb()) {
    if (targetHeight > getMetaScanHeight()) {
      await updateSpecs();
    }
  }

  const heights = [];
  for (let i = startHeight; i <= targetHeight; i++) {
    if (!negligibleHeights.includes(i)) {
      heights.push(i)
    }
  }

  const blocks = await fetchBlocks(heights);
  if ((blocks || []).length <= 0) {
    await sleep(1000);
    return startHeight;
  }

  for (const block of blocks) {
    if (negligibleHeights.includes(block.height)) {
      continue
    }

    // TODO: do following operations in one transaction
    try {
      await scanNormalizedBlock(block.block, block.events);
      await updateScanHeight(block.height);
    } catch (e) {
      await sleep(3000);
      console.log(`Error with block scan ${ block.height }`, e)
      logger.error(`Error with block scan ${ block.height }`, e);
      // process.exit(1);
    } finally {
      if (block.height % 300000 === 0) {
        process.exit(0);
      }

      const memoryInGb = getHeadUsedInGB()
      if (memoryInGb > 1) {
        console.log(
          `${ memoryInGb }GB heap used, restart process in case of memory leak`
        );
        process.exit(0);
      }
    }
  }

  const lastHeight = last(blocks || []).height;
  logger.info(`${ lastHeight } scan finished!`);
  return lastHeight + 1;
}

module.exports = {
  beginScan,
}
