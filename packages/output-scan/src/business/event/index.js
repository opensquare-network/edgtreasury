const { handleDemocracyEvents } = require("./democracy");
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

    const handlingArgs = [event, indexer, events, extrinsic];
    await handleTipEvent(...handlingArgs);
    await handleTreasuryProposalEvent(...handlingArgs);
    await handleBountyEvent(...handlingArgs);
    await handleMotionEvent(...handlingArgs);
    await handleBurntEvent(...handlingArgs);
    await handleDemocracyEvents(...handlingArgs);
  }
}

module.exports = {
  handleEvents,
};
