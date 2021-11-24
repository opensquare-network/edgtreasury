const { updateDemocracyReferendum } = require("../../../../mongo/service/democracyReferendum");
const { getReferendumInfoFromStorage } = require("../../../common/democracy/referendumStorage");
const { getReferendumInfoByHeight } = require("../../../common/democracy/referendumStorage");
const {
  ReferendumEvents,
  TimelineItemTypes,
} = require("../../../common/constants");

async function handlePassed(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex] = eventData;

  const infoBeforePassed = await getReferendumInfoByHeight(
    referendumIndex,
    indexer.blockHeight - 1
  );

  const finishedInfo = await getReferendumInfoFromStorage(
    referendumIndex,
    indexer
  );

  const state = {
    indexer,
    state: ReferendumEvents.Passed,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.Passed,
    args: {
      referendumIndex,
    },
    indexer,
  };

  await updateDemocracyReferendum(
    referendumIndex,
    {
      infoBeforePassed,
      info: finishedInfo,
      state,
    },
    timelineItem
  );
}

module.exports = {
  handlePassed,
};
