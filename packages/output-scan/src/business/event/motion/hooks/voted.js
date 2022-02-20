const { updateProposal } = require("../../../../mongo/service/proposal");
const { isStateChangeBountyMotion } = require("../../../common/bounty/utils/motion");
const { updateBounty, getBounty, } = require("../../../../mongo/service/bounty");
const { getMotionCollection } = require("../../../../mongo");
const {
  TreasuryProposalMethods,
  MotionState,
  BountyMethods,
  BountyStatus,
} = require("../../../common/constants");
const { logger } = require("../../../../logger")

function getState(name, motion, voting, indexer) {
  return {
    indexer,
    state: name,
    data: {
      motionState: motion.state,
      motionVoting: voting,
    },
  };
}

async function updateProposalState(proposalInfo, motion, voting, indexer) {
  const { index: proposalIndex, method } = proposalInfo;
  const stateName =
    method === TreasuryProposalMethods.approveProposal
      ? MotionState.ApproveVoting
      : MotionState.RejectVoting;

  const state = getState(stateName, motion, voting, indexer);

  logger.info('proposal state updated by motion voted', indexer);
  await updateProposal(proposalIndex, { state });
}

async function updateBountyState(bountyInfo, motion, voting, indexer) {
  const { index: bountyIndex, method } = bountyInfo;
  const bounty = await getBounty(bountyIndex);
  if (!bounty || [
    BountyStatus.Canceled,
    BountyStatus.Rejected,
    BountyStatus.Claimed
  ].includes(bounty.state?.state)) {
    return
  }

  if (!isStateChangeBountyMotion(method)) {
    return
  }

  let stateName;
  if (BountyMethods.closeBounty === method) {
    stateName = 'CloseVoting';
  } else if (BountyMethods.approveBounty === method) {
    stateName = 'ApproveVoting';
  }

  if (!stateName) {
    return
  }

  const state = getState(stateName, motion, voting, indexer);
  await updateBounty(bountyIndex, { state });
}

async function handleBusinessWhenMotionVoted(motionHash, voting, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash });
  if (!motion) {
    logger.error(`can not find motion when handle motion voted business, hash: ${ motionHash }`, indexer)
    return;
  }

  for (const proposalInfo of motion.treasuryProposals || []) {
    await updateProposalState(proposalInfo, motion, voting, indexer);
  }

  for (const bountyInfo of motion.treasuryBounties || []) {
    await updateBountyState(bountyInfo, motion, voting, indexer);
  }
}

module.exports = {
  handleBusinessWhenMotionVoted,
};
