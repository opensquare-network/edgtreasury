const { handleTreasuryProposeCall } = require("./proposal/propose");
const { handleTipCloseCall } = require("./tip/close");
const { handleTipCall } = require("./tip/tip");
const { handleReportAwesomeCall } = require("./tip/reportAwesome");
const { handleTipNewCall } = require("./tip/tipNew");
const { handleWrappedCall } = require("../common/call");

function extractExtrinsicEvents(events, extrinsicIndex) {
  return events.filter((event) => {
    const { phase } = event;
    return !phase.isNone && phase.value.toNumber() === extrinsicIndex;
  });
}

function isExtrinsicSuccess(events) {
  return events.some((e) => e.event.method === "ExtrinsicSuccess");
}

async function handleExtrinsics(extrinsics = [], allEvents = [], blockIndexer) {
  let index = 0;
  for (const extrinsic of extrinsics) {
    const events = extractExtrinsicEvents(allEvents, index);
    const extrinsicIndexer = { ...blockIndexer, extrinsicIndex: index++ };

    if (!isExtrinsicSuccess(events)) {
      continue;
    }

    await handleWrappedCall(extrinsic.method, extrinsic.signer, extrinsicIndexer, events, async (call, signer, indexer, events) => {
      await handleTipNewCall(call, signer, indexer, events);
      await handleReportAwesomeCall(call, signer, indexer, events);
      await handleTipCall(call, signer, indexer, events);
      await handleTipCloseCall(call, signer, indexer, events);
      await handleTreasuryProposeCall(call, signer, indexer, events)
    })
  }
}

module.exports = {
  handleExtrinsics,
};
