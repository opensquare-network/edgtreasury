const { chain: { getApi, findBlockApi } } = require("@osn/scan-common");

async function getBountyMeta(indexer, bountyIndex) {
  const blockApi = await findBlockApi(indexer.blockHash);
  let rawMeta;
  if (blockApi.query.treasury?.bounties) {
    rawMeta = await blockApi.query.treasury?.bounties(bountyIndex);
  } else {
    rawMeta = await blockApi.query.bounties.bounties(bountyIndex);
  }

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
