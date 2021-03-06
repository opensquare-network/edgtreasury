const { updateBounty } = require("../../../mongo/service/bounty");
const { getBountyMeta } = require("../../common/bounty/meta");
const {
  TimelineItemTypes,
  BountyStatus,
} = require("../../common/constants");

async function handleBountyAwarded(event, indexer) {
  const eventData = event.data.toJSON();
  const [bountyIndex, beneficiary] = eventData;

  const meta = await getBountyMeta(indexer, bountyIndex);
  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: event.method,
    args: {
      beneficiary,
    },
    eventData,
    indexer,
  };

  const state = {
    indexer,
    state: BountyStatus.PendingPayout,
  }

  await updateBounty(bountyIndex, { meta, state }, timelineItem);
}

module.exports = {
  handleBountyAwarded,
}
