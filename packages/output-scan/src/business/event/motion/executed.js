const { handleBusinessWhenMotionExecuted } = require("./hooks/executed");
const { updateMotionByHash } = require("../../../mongo/service/motion");
const {
  TimelineItemTypes,
  CouncilEvents,
} = require("../../common/constants");

async function handleExecuted(event, indexer) {
  const eventData = event.data.toJSON();
  const [hash, dispatchResult] = eventData;

  const state = {
    state: CouncilEvents.Executed,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CouncilEvents.Executed,
    args: {
      hash,
      dispatchResult,
    },
    indexer,
  };

  await handleBusinessWhenMotionExecuted(hash, indexer);
  const updates = { state, isFinal: true };
  await updateMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleExecuted,
};
