const { findDecorated } = require("../../../chain/specs");
const { getApi } = require("../../../chain/api");

async function getTreasuryProposalMeta(indexer, proposalIndex) {
  const api = await getApi();
  const decorated = await findDecorated(indexer.blockHeight);
  const key = [decorated.query.treasury.proposals, proposalIndex];

  const raw = await api.rpc.state.getStorage(key, indexer.blockHash);
  return raw.toJSON();
}

module.exports = {
  getTreasuryProposalMeta,
};
