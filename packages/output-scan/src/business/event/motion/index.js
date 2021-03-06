const { handleExecuted } = require("./executed");
const { handleDisApproved } = require("./disApproved");
const { handleApproved } = require("./approved");
const { handleClosed } = require("./closed");
const { handleVoted } = require("./voted");
const { handleProposed } = require("./proposed");
const {
  Modules,
  CouncilEvents,
} = require("../../common/constants");

function isCouncilModule(section) {
  return Modules.Council === section;
}

async function handleMotionEvent(event, indexer, events, extrinsic) {
  const { section, method } = event;
  if (!isCouncilModule(section)) {
    return;
  }

  if (CouncilEvents.Proposed === method) {
    await handleProposed(event, indexer, events);
  } else if (CouncilEvents.Voted === method) {
    await handleVoted(...arguments);
  } else if (CouncilEvents.Closed === method) {
    await handleClosed(...arguments);
  } else if (CouncilEvents.Approved === method) {
    await handleApproved(...arguments);
  } else if (CouncilEvents.Disapproved === method) {
    await handleDisApproved(...arguments);
  } else if (CouncilEvents.Executed === method) {
    await handleExecuted(...arguments);
  }
}

module.exports = {
  handleMotionEvent,
}
