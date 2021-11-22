const { handleBurntEvent } = require("./burnt");
const { handleMotionEvent } = require("./motion");
const { handleBountyEvent } = require("./bounty");
const { handleTreasuryProposalEvent } = require("./proposal");
const { handleTipEvent } = require("./tip");

async function handleEvents(events, extrinsics, blockIndexer) {
  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    let indexer = {
      ...blockIndexer,
      eventIndex: sort,
    };

    let extrinsic;
    if (!phase.isNull) {
      const extrinsicIndex = phase.value.toNumber();
      indexer = {
        ...indexer,
        extrinsicIndex,
      };
      extrinsic = extrinsics[extrinsicIndex];
    }

    await handleTipEvent(event, indexer, events, extrinsic);
    await handleTreasuryProposalEvent(event, indexer, events, extrinsic);
    await handleBountyEvent(event, indexer, events, extrinsic);
    await handleMotionEvent(event, indexer, events, extrinsic);
    await handleBurntEvent(event, indexer, events, extrinsic);
  }
}

module.exports = {
  handleEvents,
};
