const { findDecorated } = require("../../../chain/specs");
const { getApi } = require("../../../chain/api");

async function getMotionVoting(indexer, motionHash) {
  const api = await getApi();
  const decorated = await findDecorated(indexer.blockHeight);
  const key = [decorated.query.council.voting, motionHash];

  const raw = await api.rpc.state.getStorage(key, indexer.blockHash);
  return raw.toJSON();
}

async function getVotingFromStorageByHeight(motionHash, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return await getMotionVoting({
    blockHeight,
    blockHash
  }, motionHash);
}

module.exports = {
  getVotingFromStorageByHeight,
  getMotionVoting,
};
