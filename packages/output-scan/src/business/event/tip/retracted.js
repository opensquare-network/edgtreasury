const { updateTipByHash } = require("../../../mongo/service/tip");
const {
  TipEvents,
  TimelineItemTypes,
} = require("../../common/constants");
const { getTipCommonUpdates } = require("../../common/tip/updates");
const { chain: { getBlockHash } } = require("@osn/scan-common");

async function updateTipWithTipRetracted(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash] = eventData;

  const blockHash = await getBlockHash(indexer.blockHeight - 1);
  let updates = await getTipCommonUpdates(hash, {
    blockHeight: indexer.blockHeight - 1,
    blockHash,
  });
  const state = {
    indexer,
    state: TipEvents.TipRetracted,
    data: eventData,
  };
  updates = {
    ...updates,
    isFinal: true,
    state,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TipEvents.TipRetracted,
    args: {},
    indexer,
  };
  await updateTipByHash(hash, updates, timelineItem);
}

module.exports = {
  updateTipWithTipRetracted,
}
