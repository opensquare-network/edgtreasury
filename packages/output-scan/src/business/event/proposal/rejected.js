const { updateProposal } = require("../../../mongo/service/proposal");
const {
  TreasuryProposalEvents,
  TimelineItemTypes,
} = require("../../common/constants");
const { logger } = require("../../../logger")

async function handleRejected(event, eventIndexer) {
  const eventData = event.data.toJSON();
  const [proposalId, value] = eventData;

  const state = {
    state: TreasuryProposalEvents.Rejected,
    data: eventData,
    indexer: eventIndexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    name: TreasuryProposalEvents.Rejected,
    args: {
      proposalIndex: proposalId,
      value,
    },
    eventData,
    indexer: eventIndexer,
  };

  await updateProposal(proposalId, { state }, timelineItem);
  logger.info(`Treasury proposal ${ proposalId } rejected at`, eventIndexer);
}

module.exports = {
  handleRejected,
}
