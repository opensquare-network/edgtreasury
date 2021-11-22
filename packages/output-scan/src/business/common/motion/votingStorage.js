const { getApi } = require("../../../chain/api");

async function getMotionVoting(blockHash, motionHash) {
  const api = await getApi()

  const raw = await api.query.council.voting.at(blockHash, motionHash);
  return raw.toJSON();
}

async function getVotingFromStorageByHeight(motionHash, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return await getMotionVoting(blockHash, motionHash);
}

module.exports = {
  getVotingFromStorageByHeight,
  getMotionVoting,
};
