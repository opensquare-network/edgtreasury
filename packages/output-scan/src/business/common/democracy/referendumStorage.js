const { chain: { findBlockApi, getApi } } = require("@osn/scan-common");

async function getRawReferendumInfo(referendumIndex, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  return await blockApi.query.democracy.referendumInfoOf(referendumIndex);
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
