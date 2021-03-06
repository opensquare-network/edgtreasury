const { isUseMetaDb } = require("../env");
const { specialHeights } = require("./specialHeights");
const { getApi } = require("../chain/api");
const { findRegistry } = require("../chain/specs");
const { getBlocksByHeights } = require("../mongo/meta");
const { GenericBlock } = require("@polkadot/types");
const { logger } = require("../logger")

async function fetchBlocks(heights = []) {
  if (isUseMetaDb()) {
    return await fetchBlocksFromDb(heights);
  } else {
    return await fetchBlocksFromNode(heights);
  }
}

async function constructBlockFromDbData(blockInDb) {
  const registry = await findRegistry(blockInDb.height);
  const block = new GenericBlock(registry, blockInDb.block.block);
  const allEvents = registry.createType(
    "Vec<EventRecord>",
    blockInDb.events,
    true
  );

  return {
    height: blockInDb.height,
    block,
    events: allEvents,
  }
}

async function fetchBlocksFromDb(heights = []) {
  const blocksInDb = await getBlocksByHeights(heights);

  const blocks = [];
  for (const blockInDb of blocksInDb) {
    if (specialHeights.includes(blockInDb.height)) {
      blocks.push({ height: blocksInDb.height });
      continue
    }

    let block
    try {
      block = await constructBlockFromDbData(blockInDb);
    } catch (e) {
      logger.error(`can not construct block from db data at ${ blockInDb.height }`, e)
      block = await fetchOneBlockFromNode(blockInDb.height);
    }

    blocks.push(block)
  }

  return blocks;
}

async function fetchBlocksFromNode(heights = []) {
  const allPromises = []
  for (const height of heights) {
    allPromises.push(fetchOneBlockFromNode(height))
  }

  return await Promise.all(allPromises)
}

async function fetchOneBlockFromNode(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);

  return {
    height,
    block: block.block,
    events: allEvents,
  }
}

module.exports = {
  fetchBlocks,
}
