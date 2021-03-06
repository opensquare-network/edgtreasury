const { updateDemocracyReferendum } = require("../../../../mongo/service/democracyReferendum");
const {
  getReferendumInfoByHeight,
  getReferendumInfoFromStorage
} = require("../../../common/democracy/referendumStorage");
const {
  ReferendumEvents,
  TimelineItemTypes,
} = require("../../../common/constants");

async function handleNotPassed(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex] = eventData;

  const infoBeforeNotPadded = await getReferendumInfoByHeight(
    referendumIndex,
    indexer.blockHeight - 1
  );

  const finishedInfo = await getReferendumInfoFromStorage(
    referendumIndex,
    indexer
  );

  const state = {
    indexer,
    state: ReferendumEvents.NotPassed,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.NotPassed,
    args: {
      referendumIndex,
    },
    indexer,
  };

  await updateDemocracyReferendum(
    referendumIndex,
    {
      infoBeforeNotPadded,
      info: finishedInfo,
      state,
    },
    timelineItem
  );
}

module.exports = {
  handleNotPassed,
};
