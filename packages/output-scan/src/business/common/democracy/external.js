const { getApi } = require("../../../chain/api")

async function getExternalFromStorage(blockHash) {
  const api = await getApi();
  const raw = await api.query.democracy.nextExternal.at(blockHash);
  return raw.toJSON();
}

async function getExternalFromStorageByHeight(blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return await getExternalFromStorage(blockHash);
}

module.exports = {
  getExternalFromStorage,
  getExternalFromStorageByHeight,
};
