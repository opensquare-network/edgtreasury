const { insertDemocracyReferendum } = require("../../../../mongo/service/democracyReferendum");
const { getReferendumInfoFromStorage } = require("../../../common/democracy/referendumStorage");
const {
  ReferendumEvents,
  TimelineItemTypes,
} = require("../../../common/constants");

async function handleStarted(event, indexer, blockEvents = []) {
  const eventData = event.data.toJSON();
  const [referendumIndex, threshold] = eventData;

  const referendumInfo = await getReferendumInfoFromStorage(
    referendumIndex,
    indexer
  );

  const state = {
    indexer,
    state: ReferendumEvents.Started,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.Started,
    args: {
      referendumIndex,
      voteThreshold: threshold,
    },
    indexer,
  };

  const obj = {
    indexer,
    index: referendumIndex,
    info: referendumInfo,
    state,
    timeline: [timelineItem],
  }

  await insertDemocracyReferendum(obj);
}

module.exports = {
  handleStarted,
};
