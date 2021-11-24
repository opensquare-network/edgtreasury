const { updateDemocracyReferendum } = require("../../../../mongo/service/democracyReferendum");
const { getReferendumInfoByHeight } = require("../../../common/democracy/referendumStorage");
const {
  ReferendumEvents,
  TimelineItemTypes,
} = require("../../../common/constants");

async function handleCancelled(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex] = eventData;

  const referendumInfo = await getReferendumInfoByHeight(
    referendumIndex,
    indexer.blockHeight - 1
  );

  const state = {
    indexer,
    state: ReferendumEvents.Cancelled,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.Cancelled,
    args: {
      referendumIndex,
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
  handleCancelled,
};
