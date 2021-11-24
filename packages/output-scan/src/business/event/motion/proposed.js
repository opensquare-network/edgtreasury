const { addProposalExternalMotion } = require("../../../mongo/service/proposal");
const { getTreasuryProposalInfoFromImage } = require("../../common/democracy/preImage/isTreasuryProposal");
const { isDemocracyExternalMotion } = require("../../common/democracy/utils");
const { handleBusinessWhenMotionProposed } = require("./hooks/proposed");
const { isProposalMotion } = require("../../common/motion/utils");
const { isBountyMotion } = require("../../common/bounty/utils/motion");
const { handleWrappedCall } = require("../../common/call");
const { insertMotion } = require("../../../mongo/service/motion");
const {
  TimelineItemTypes,
  CouncilEvents,
} = require("../../common/constants");
const { getMotionVoting } = require("../../common/motion/votingStorage");
const { getMotionCall, getMotionProposalCall } = require("../../common/motion/proposalStorage");

async function handleProposed(event, indexer, blockEvents) {
  const eventData = event.data.toJSON();
  const [proposer, motionIndex, hash, threshold] = eventData;

  const rawProposal = await getMotionCall(hash, indexer);
  const proposalCall = await getMotionProposalCall(hash, indexer);
  const voting = await getMotionVoting(indexer, hash);

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CouncilEvents.Proposed,
    args: {
      proposer,
      index: motionIndex,
      hash,
      threshold,
    },
    indexer,
  };

  const state = {
    indexer,
    state: CouncilEvents.Proposed,
    data: eventData,
  };

  const treasuryProposals = [];
  const treasuryBounties = [];
  await handleWrappedCall(
    rawProposal,
    proposer,
    indexer,
    blockEvents,
    async (call, singer, indexer) => {
      const { section, method, args } = call;
      if (isProposalMotion(section, method)) {
        const treasuryProposalIndex = args[0].toJSON();
        treasuryProposals.push({
          index: treasuryProposalIndex,
          method,
        });
      } else if (isBountyMotion(section, method)) {
        const treasuryBountyIndex = args[0].toJSON();
        treasuryBounties.push({
          index: treasuryBountyIndex,
          method,
        });
      } else if (isDemocracyExternalMotion(section, method)) {
        const proposalHash = args[0].toJSON();
        const proposalInfo = await getTreasuryProposalInfoFromImage(proposalHash, indexer);

        const externalInfo = {
          indexer,
          section,
          method,
          proposalInfo,
        }
        if (proposalInfo) {
          await addProposalExternalMotion(proposalInfo.proposalIndex, externalInfo);
        }
      }
    },
  )

  const obj = {
    indexer,
    hash,
    proposer,
    index: motionIndex,
    threshold,
    proposal: proposalCall,
    voting,
    isFinal: false,
    state,
    timeline: [timelineItem],
    treasuryProposals,
    treasuryBounties,
  };

  await insertMotion(obj);
  await handleBusinessWhenMotionProposed(obj, rawProposal, indexer, blockEvents);
}

module.exports = {
  handleProposed,
}
