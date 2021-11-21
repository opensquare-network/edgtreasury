const { handleBountyBecameActiveEvent } = require("./becameActive");
const { handleBountyExtended } = require("./extended");
const { handleBountyCanceled } = require("./canceled");
const { handleBountyClaimed } = require("./claimed");
const { handleBountyRejected } = require("./rejected");
const { handleBountyAwarded } = require("./awarded");
const { handleProposed } = require("./proposed");
const {
  Modules,
  BountyEvents,
} = require("../../common/constants");

function isBountyEvent(section, method) {
  return (
    [Modules.Treasury, Modules.Bounties].includes(section) &&
    BountyEvents.hasOwnProperty(method)
  );
}

async function handleBountyEvent(event, indexer, events, extrinsic) {
  const { section, method } = event;
  if (!isBountyEvent(section, method)) {
    return;
  }

  if (BountyEvents.BountyProposed === method) {
    await handleProposed(event, indexer);
  } else if (BountyEvents.BountyAwarded === method) {
    await handleBountyAwarded(event, indexer);
  } else if (BountyEvents.BountyRejected === method) {
    await handleBountyRejected(event, indexer);
  } else if (BountyEvents.BountyClaimed === method) {
    await handleBountyClaimed(event, indexer);
  } else if (BountyEvents.BountyCanceled === method) {
    await handleBountyCanceled(event, indexer, extrinsic);
  } else if (BountyEvents.BountyExtended === method) {
    await handleBountyExtended(event, indexer, events, extrinsic);
  } else if (BountyEvents.BountyBecameActive === method) {
    await handleBountyBecameActiveEvent(event, indexer);
  }

}

module.exports = {
  handleBountyEvent,
}
