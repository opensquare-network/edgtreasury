const { getBlockIndexer } = require("../business/common/block/getBlockIndexer");
const { getApi } = require("../chain/api");

async function getBlockIndexerByHeight(blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  const block = await api.rpc.chain.getBlock(blockHash);
  return getBlockIndexer(block.block);
}

module.exports = {
  getBlockIndexerByHeight,
};
