const { updateMotionByHash } = require("../../../mongo/service/motion");
const {
  getVotingFromStorageByHeight,
} = require("../../common/motion/votingStorage");
const {
  TimelineItemTypes,
  CouncilEvents,
} = require("../../common/constants");

async function handleClosed(event, indexer) {
  const eventData = event.data.toJSON();
  const [hash, yesVotes, noVotes] = eventData;

  const voting = await getVotingFromStorageByHeight(
    hash,
    indexer.blockHeight - 1
  );

  const state = {
    state: CouncilEvents.Closed,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CouncilEvents.Closed,
    args: {
      hash,
      yesVotes,
      noVotes,
    },
    indexer,
  };

  const updates = { voting, state };
  await updateMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleClosed,
};
