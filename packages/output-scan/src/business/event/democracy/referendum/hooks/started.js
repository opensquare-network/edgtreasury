const { addProposalReferendum } = require("../../../../../mongo/service/proposal");
const { getTreasuryProposalInfoFromImage } = require("../../../../common/democracy/preImage/isTreasuryProposal");

async function handleBusinessWhenReferendumStarted(referendumIndex, preimageHash, indexer) {
  const proposalTreasuryInfo = await getTreasuryProposalInfoFromImage(preimageHash, indexer)
  if (!proposalTreasuryInfo) {
    return
  }

  await addProposalReferendum(proposalTreasuryInfo.proposalIndex, {
    indexer,
    referendumIndex,
    proposalInfo: proposalTreasuryInfo,
  })
}

module.exports = {
  handleBusinessWhenReferendumStarted,
}
