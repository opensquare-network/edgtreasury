const { updateTipByHash } = require("../../../mongo/service/tip");
const { TipEvents, TimelineItemTypes } = require("../../common/constants");
const { getTipCommonUpdates } = require("../../common/tip/updates");
const { chain: { getBlockHash } } = require("@osn/scan-common");

async function updateTipWithTipClosed(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash, beneficiary, payout] = eventData;

  const blockHash = await getBlockHash(indexer.blockHeight - 1);
  let updates = await getTipCommonUpdates(hash, {
    blockHeight: indexer.blockHeight - 1,
    blockHash,
  });
  const state = {
    indexer,
    state: TipEvents.TipClosed,
    data: eventData,
  };
  updates = {
    ...updates,
    isFinal: true,
    state,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TipEvents.TipClosed,
    args: {
      beneficiary,
      payout,
    },
    indexer,
  };
  await updateTipByHash(hash, updates, timelineItem);
}

module.exports = {
  updateTipWithTipClosed,
}
