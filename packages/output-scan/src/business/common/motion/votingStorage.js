const { chain: { getApi, findBlockApi } } = require("@osn/scan-common");

async function getMotionVoting(indexer, motionHash) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.council.voting(motionHash);
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
