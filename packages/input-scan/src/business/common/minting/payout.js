const { chain: { getApi } } = require("@osn/scan-common");

async function queryCurrentPayout(blockHash) {
  const api = await getApi()
  const raw = await api.query.treasuryReward.currentPayout.at(blockHash);

  return raw.toString()
}

module.exports = {
  queryCurrentPayout,
}
