const { handleAwarded } = require("./awarded");
const { handleRejected } = require("./rejected");
const { Modules, TreasuryProposalEvents, } = require("../../common/constants");

function isTreasuryProposalEvent(section, method) {
  if (![Modules.Treasury, Modules.Tips].includes(section)) {
    return false;
  }

  return TreasuryProposalEvents.hasOwnProperty(method);
}

async function handleTreasuryProposalEvent(event, indexer, events, extrinsic) {
  const { section, method, data } = event;
  if (!isTreasuryProposalEvent(section, method)) {
    return;
  }

  if (TreasuryProposalEvents.Rejected === method) {
    await handleRejected(event, indexer);
  } else if (TreasuryProposalEvents.Awarded === method) {
    await handleAwarded(...arguments);
  }
}

module.exports = {
  handleTreasuryProposalEvent,
}
