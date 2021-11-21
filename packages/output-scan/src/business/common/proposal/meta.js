const { getApi } = require("../../../chain/api");

async function getTreasuryProposalMeta(blockHash, proposalIndex) {
  const api = await getApi();

  const raw = await api.query.treasury.proposals.at(blockHash, proposalIndex);
  return raw.toJSON();
}

module.exports = {
  getTreasuryProposalMeta,
};
