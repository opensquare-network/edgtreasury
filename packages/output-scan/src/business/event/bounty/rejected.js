const { getBountyMetaByHeight } = require("../../common/bounty/meta");
const { updateBounty } = require("../../../mongo/service/bounty");
const {
  TimelineItemTypes,
  BountyStatus,
} = require("../../common/constants");

async function handleBountyRejected(event, indexer) {
  const eventData = event.data.toJSON();
  const [bountyIndex, slashed] = eventData;

  const meta = await getBountyMetaByHeight(bountyIndex, indexer.blockHeight - 1);
  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: event.method,
    args: {
      slashed,
    },
    eventData,
    indexer,
  };

  const state = {
    indexer,
    state: BountyStatus.Rejected,
  }

  await updateBounty(bountyIndex, { meta, state }, timelineItem);
}

module.exports = {
  handleBountyRejected,
}
