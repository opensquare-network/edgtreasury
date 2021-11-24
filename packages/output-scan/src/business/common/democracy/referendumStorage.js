const { getApi } = require("../../../chain/api")

async function getRawReferendumInfo(referendumIndex, indexer) {
  const api = await getApi();
  return api.query.democracy.referendumInfoOf.at(indexer.blockHash, referendumIndex);
}

async function getReferendumInfoFromStorage(referendumIndex, indexer) {
  const api = await getApi();
  const raw = await api.query.democracy.referendumInfoOf.at(indexer.blockHash, referendumIndex);
  return raw.toJSON();
}

async function getReferendumInfoByHeight(referendumIndex, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return getReferendumInfoFromStorage(referendumIndex, {
    blockHeight,
    blockHash,
  });
}

module.exports = {
  getRawReferendumInfo,
  getReferendumInfoFromStorage,
  getReferendumInfoByHeight,
};