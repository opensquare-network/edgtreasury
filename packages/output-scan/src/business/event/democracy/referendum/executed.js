const { updateDemocracyReferendum } = require("../../../../mongo/service/democracyReferendum");
const { getReferendumInfoByHeight } = require("../../../common/democracy/referendumStorage");
const {
  ReferendumEvents,
  TimelineItemTypes,
} = require("../../../common/constants");

async function handleExecuted(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex, executeResult] = eventData;

  const referendumInfo = await getReferendumInfoByHeight(
    referendumIndex,
    indexer.blockHeight - 1
  );

  const state = {
    indexer,
    state: ReferendumEvents.Executed,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.Executed,
    args: {
      referendumIndex,
      result: executeResult,
    },
    indexer,
  };

  await updateDemocracyReferendum(
    referendumIndex,
    {
      info: referendumInfo,
      state,
    },
    timelineItem
  );
}

module.exports = {
  handleExecuted,
};
