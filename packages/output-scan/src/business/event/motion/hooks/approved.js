const { updateProposal } = require("../../../../mongo/service/proposal");
const { getMotionCollection } = require("../../../../mongo");
const {
  CouncilEvents,
  TreasuryProposalMethods,
} = require("../../../common/constants");

async function handleProposal(proposalInfo, indexer) {
  const { index: treasuryProposalIndex, method } = proposalInfo;

  const isApproved = TreasuryProposalMethods.approveProposal === method;
  if (!isApproved) {
    return;
  }

  const state = {
    indexer,
    state: CouncilEvents.Approved,
  };

  await updateProposal(treasuryProposalIndex, { state });
}

async function handleBusinessWhenMotionApproved(motionHash, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    return;
  }

  for (const proposalInfo of motion.treasuryProposals || []) {
    await handleProposal(proposalInfo, indexer);
  }
}

module.exports = {
  handleBusinessWhenMotionApproved,
};
