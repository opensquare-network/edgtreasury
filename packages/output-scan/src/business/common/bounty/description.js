const { findDecorated } = require("../../../chain/specs");
const { getApi } = require("../../../chain/api");

async function getBountyDescription(indexer, bountyIndex) {
  const api = await getApi();
  const decorated = await findDecorated(indexer.blockHeight);

  let key;
  if (decorated.query.treasury?.bountyDescriptions) {
    key = [decorated.query.treasury?.bountyDescriptions, bountyIndex];
  } else {
    key = [decorated.query.bounties?.bountyDescriptions, bountyIndex];
  }

  const rawMeta = await api.rpc.state.getStorage(key, indexer.blockHash);
  return rawMeta.toHuman();
}

module.exports = {
  getBountyDescription,
}
