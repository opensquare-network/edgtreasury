const { handleBusinessWhenReferendumStarted } = require("./hooks/started");
const { getRawReferendumInfo } = require("../../../common/democracy/referendumStorage");
const { insertDemocracyReferendum } = require("../../../../mongo/service/democracyReferendum");
const {
  ReferendumEvents,
  TimelineItemTypes,
} = require("../../../common/constants");

async function handleStarted(event, indexer, blockEvents = []) {
  const eventData = event.data.toJSON();
  const [referendumIndex, threshold] = eventData;

  const infoRaw = await getRawReferendumInfo(referendumIndex, indexer);
  if (!infoRaw.isSome) {
    throw new Error(`find no referendumInfo at ${ indexer.blockHeight }`)
  }
  const referendumInfo = infoRaw.toJSON();

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
  let proposalHash = referendumInfo.proposalHash;
  if (!proposalHash) {
    proposalHash = referendumInfo.Ongoing.proposalHash;
  }
  await handleBusinessWhenReferendumStarted(referendumIndex, proposalHash, indexer);
}

module.exports = {
  handleStarted,
};
