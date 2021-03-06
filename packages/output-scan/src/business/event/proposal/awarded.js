const { updateProposal } = require("../../../mongo/service/proposal");
const {
  TreasuryProposalEvents,
  TimelineItemTypes,
} = require("../../common/constants");
const { logger } = require("../../../logger")

async function handleAwarded(event, eventIndexer) {
  const eventData = event.data.toJSON();
  const [proposalIndex, award, beneficiary] = eventData;

  const state = {
    state: TreasuryProposalEvents.Awarded,
    data: eventData,
    indexer: eventIndexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    name: TreasuryProposalEvents.Awarded,
    args: {
      award,
      beneficiary,
    },
    indexer: eventIndexer,
  };

  await updateProposal(proposalIndex, { state }, timelineItem);
  logger.info(`Treasury proposal ${proposalIndex} awarded at`, eventIndexer);
}

module.exports = {
  handleAwarded,
}
