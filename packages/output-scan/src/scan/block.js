const { updateScanHeight } = require("../mongo/scanHeight");
const { tryCreateStatPoint } = require("../stats");
const { handleExtrinsics } = require("../business/extrinsic");
const { handleEvents } = require("../business/event");
const { getBlockIndexer } = require("../business/common/block/getBlockIndexer");

async function handleBlock({ height, block, events }) {
  const blockIndexer = getBlockIndexer(block);
  await tryCreateStatPoint(blockIndexer);

  await handleExtrinsics(block?.extrinsics, events, blockIndexer);
  await handleEvents(events, block?.extrinsics, blockIndexer);

  await updateScanHeight(height);
}

async function scanNormalizedBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);
  // await tryCreateStatPoint(blockIndexer);

  await handleEvents(blockEvents, block.extrinsics, blockIndexer);
  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
}

module.exports = {
  scanNormalizedBlock,
  handleBlock,
}
