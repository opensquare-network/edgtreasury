const { updateBounty } = require("../../../mongo/service/bounty");
const { getBountyMetaByHeight } = require("../../common/bounty/meta");
const {
  TimelineItemTypes,
  BountyStatus,
} = require("../../common/constants");

async function handleBountyCanceled(event, indexer) {
  const eventData = event.data.toJSON();
  const [bountyIndex] = eventData;

  const meta = await getBountyMetaByHeight(bountyIndex, indexer.blockHeight - 1);

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: event.method,
    args: {},
    eventData,
    indexer,
  };

  const state = {
    indexer,
    state: BountyStatus.Canceled,
  }

  await updateBounty(bountyIndex, { meta, state }, timelineItem);
}

module.exports = {
  handleBountyCanceled,
}
