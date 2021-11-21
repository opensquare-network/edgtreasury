const { getApi } = require("../../../chain/api");

async function getBountyMeta(blockHash, bountyIndex) {
  const api = await getApi();

  let rawMeta;
  if (api.query.treasury?.bounties) {
    rawMeta = await api.query.treasury?.bounties.at(blockHash, bountyIndex);
  } else {
    rawMeta = await api.query.bounties.bounties.at(blockHash, bountyIndex);
  }

  return rawMeta.toJSON();
}

async function getBountyMetaByHeight(bountyIndex, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);

  return await getBountyMeta(blockHash, bountyIndex);
}

module.exports = {
  getBountyMeta,
  getBountyMetaByHeight,
}
