const { updateTipByHash } = require("../../../mongo/service/tip");
const {
  TipEvents,
  TimelineItemTypes,
} = require("../../common/constants");
const { getTipCommonUpdates } = require("../../common/tip/updates");
const { chain: { getBlockHash } } = require("@osn/scan-common");

async function updateTipWithTipSlashed(event, indexer) {
  const eventData = event.data.toJSON();
  const [hash, finder, slashed] = eventData;

  const blockHash = await getBlockHash(indexer.blockHeight - 1);
  let updates = await getTipCommonUpdates(hash, {
    blockHeight: indexer.blockHeight - 1,
    blockHash,
  });
  const state = {
    indexer,
    state: TipEvents.TipSlashed,
    data: eventData,
  };
  updates = {
    ...updates,
    isFinal: true,
    state,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TipEvents.TipSlashed,
    args: {
      finder,
      slashed,
    },
    indexer,
  };
  await updateTipByHash(hash, updates, timelineItem);
}

module.exports = {
  updateTipWithTipSlashed,
}
