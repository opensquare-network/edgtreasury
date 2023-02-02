const { updateTipByHash } = require("../../../mongo/service/tip");
const { getActiveTipByHash } = require("../../../mongo/service/tip");
const { getTipCommonUpdates } = require("../../common/tip/updates");
const {
  TimelineItemTypes,
  TipMethods,
  Modules,
  TipEvents,
  BalancesEvents,
  edgTreasuryAccount,
} = require("../../common/constants");
const { chain: { getBlockHash } } = require("@osn/scan-common");

async function handleTipCloseCall(call, signer, indexer, events) {
  if (
    ![Modules.Treasury, Modules.Tips].includes(call.section) ||
    TipMethods.closeTip !== call.method
  ) {
    return;
  }

  const hash = call.args[0].toJSON();

  const hasTipClosedEvent = events.some(({ event: { section, method } = {} }) => {
    return [Modules.Treasury, Modules.Tips].includes(section) && TipEvents.TipClosed === method
  })

  if (hasTipClosedEvent) {
    return
  }

  const tipInDb = await getActiveTipByHash(hash)

  const blockHash = await getBlockHash(indexer.blockHeight - 1);
  let updates = await getTipCommonUpdates(hash, {
    blockHeight: indexer.blockHeight - 1,
    blockHash,
  });
  const state = {
    indexer,
    state: TipEvents.TipClosed,
    data: [hash],
  };
  updates = {
    ...updates,
    isFinal: true,
    state,
  };

  const theTransferEvent = events.find(({ event: { section, method, data } = {} }) => {
    if (Modules.Balances !== section || BalancesEvents.Transfer !== method) {
      return false
    }

    const [from, to] = data.toJSON()
    return edgTreasuryAccount === from && to === tipInDb.beneficiary
  })

  if (!theTransferEvent) {
    throw `Can not find the treasury transfer event with tip#close method at ${ indexer.blockHeight }`
  }

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: TipEvents.TipClosed,
    args: {
      beneficiary: tipInDb.beneficiary,
      payout: theTransferEvent.event.data[2].toString(),
    },
    indexer,
  };

  await updateTipByHash(hash, updates, timelineItem);
}

module.exports = {
  handleTipCloseCall,
}
