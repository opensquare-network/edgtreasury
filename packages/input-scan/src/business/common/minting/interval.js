const { chain: { getApi } } = require("@osn/scan-common");

async function queryMintingInterval(blockHash) {
  const api = await getApi()
  const raw = await api.query.treasuryReward.mintingInterval.at(blockHash);

  return raw.toNumber()
}

module.exports = {
  queryMintingInterval,
}
