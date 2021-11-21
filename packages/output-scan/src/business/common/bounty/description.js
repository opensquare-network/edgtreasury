const { getApi } = require("../../../chain/api");

async function getBountyDescription(blockHash, bountyIndex) {
  const api = await getApi();

  let rawMeta;
  if (api.query.treasury?.bountyDescriptions) {
    rawMeta = await api.query.treasury?.bountyDescriptions.at(blockHash, bountyIndex);
  } else {
    rawMeta = await api.query.bounties.bountyDescriptions.at(blockHash, bountyIndex);
  }

  return rawMeta.toHuman();
}

module.exports = {
  getBountyDescription,
}
