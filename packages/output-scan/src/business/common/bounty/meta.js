const { findDecorated } = require("../../../chain/specs");
const { getApi } = require("../../../chain/api");

async function getBountyMeta(indexer, bountyIndex) {
  const api = await getApi();
  const decorated = await findDecorated(indexer.blockHeight);

  let key;
  if (decorated.query.treasury?.bounties) {
    key = [decorated.query.treasury?.bounties, bountyIndex];
  } else {
    key = [decorated.query.bounties?.bounties, bountyIndex];
  }

  const rawMeta = await api.rpc.state.getStorage(key, indexer.blockHash);
  return rawMeta.toJSON();
}

async function getBountyMetaByHeight(bountyIndex, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);

  return await getBountyMeta({
    blockHeight,
    blockHash
  }, bountyIndex);
}

module.exports = {
  getBountyMeta,
  getBountyMetaByHeight,
}
