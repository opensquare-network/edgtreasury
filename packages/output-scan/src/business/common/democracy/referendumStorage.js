const { findDecorated } = require("../../../chain/specs");
const { getApi } = require("../../../chain/api")

async function getRawReferendumInfo(referendumIndex, indexer) {
  const decorated = await findDecorated(indexer.blockHeight);
  const key = [decorated.query.democracy.referendumInfoOf, referendumIndex];
  const api = await getApi();
  return await api.rpc.state.getStorage(key, indexer.blockHash);
}

async function getReferendumInfoFromStorage(referendumIndex, indexer) {
  const raw = await getRawReferendumInfo(...arguments);
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
