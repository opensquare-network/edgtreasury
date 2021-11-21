const { handleExtrinsics } = require("../business/extrinsic");
const { handleEvents } = require("../business/event");
const { getBlockIndexer } = require("../business/common/block/getBlockIndexer");

async function scanNormalizedBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);

  await handleEvents(blockEvents, block.extrinsics, blockIndexer);
  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
}

module.exports = {
  scanNormalizedBlock,
}
