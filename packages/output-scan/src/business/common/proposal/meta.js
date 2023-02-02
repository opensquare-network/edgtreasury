const { chain: { findBlockApi } } = require("@osn/scan-common");

async function getTreasuryProposalMeta(indexer, proposalIndex) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.treasury.proposals(proposalIndex);
  return raw.toJSON();
}

module.exports = {
  getTreasuryProposalMeta,
};
