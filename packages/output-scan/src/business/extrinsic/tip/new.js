const { insertTip } = require("../../../mongo/service/tip");
const { getTippersCountFromApi, getTipFindersFeeFromApi } = require("../../common/tip/utils");
const { computeTipValue } = require("../../common/tip/median");
const { getTipMetaFromStorage } = require("../../common/tip/utils");
const {
  TipEvents,
  Modules,
  TimelineItemTypes,
} = require("../../common/constants");
const BigNumber = require("bignumber.js")

async function handleNewTip(call, author, indexer, events, isReport = false) {
  const finder = author.toString();
  const newTipEvent = events.find(({ event: { section, method } = {} }) => {
    return [Modules.Treasury, Modules.Tips].includes(section) && TipEvents.NewTip === method
  })
  if (!newTipEvent) {
    throw `Found new tip without NewTip event at ${ indexer.blockHeight }`
  }

  const [tipHash] = newTipEvent.event.data.toJSON()
  const reason = call.args[0].toHuman();

  const newMeta = await getTipMetaFromStorage(indexer.blockHash, tipHash);
  const medianValue = computeTipValue(newMeta)
  const tippersCount = await getTippersCountFromApi(indexer.blockHash);
  const tipFindersFee = await getTipFindersFeeFromApi(indexer.blockHash);

  if (newMeta?.reason) {
    newMeta.reason = reason;
  }

  const beneficiary = call.args[1].toString();
  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: call.method,
    args: {
      finder,
      beneficiary,
      reason,
    },
    indexer,
  }

  if (!isReport) {
    timelineItem.args.value = call.args[2].toString()
  }

  const obj = {
    indexer,
    hash: tipHash,
    reason,
    finder,
    beneficiary,
    medianValue: new BigNumber(medianValue).toString(),
    meta: newMeta,
    tippersCount,
    tipFindersFee,
    isFinal: false,
    state: {
      indexer,
      state: TipEvents.NewTip,
    },
    timeline: [timelineItem]
  }

  await insertTip(obj)
}

module.exports = {
  handleNewTip,
}
