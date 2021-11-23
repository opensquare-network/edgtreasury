const { getApi } = require("../../../chain/api");

async function queryCurrentPayout(blockHash) {
  const api = await getApi()
  const raw = await api.query.treasuryReward.currentPayout.at(blockHash);

  return raw.toString()
}

module.exports = {
  queryCurrentPayout,
}
