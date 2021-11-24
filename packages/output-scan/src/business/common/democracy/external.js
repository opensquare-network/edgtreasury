const { findDecorated } = require("../../../chain/specs");
const { getApi } = require("../../../chain/api")

async function getExternalFromStorage(indexer) {
  const decorated = await findDecorated(indexer.blockHeight);
  const key = [decorated.query.democracy.nextExternal];


  const api = await getApi();
  const raw = await api.rpc.state.getStorage(key, indexer.blockHash);
  return raw.toJSON();
}

async function getExternalFromStorageByHeight(blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return await getExternalFromStorage({
    blockHeight,
    blockHash
  });
}

module.exports = {
  getExternalFromStorage,
  getExternalFromStorageByHeight,
};
