const { handleNotPassed } = require("./notPassed");
const { handleExecuted } = require("./executed");
const { handleCancelled } = require("./cancelled");
const { handlePassed } = require("./passed");
const { handleStarted } = require("./started");
const { Modules, ReferendumEvents } = require("../../../common/constants");

function isReferendumEvent(section, method) {
  if (![Modules.Democracy].includes(section)) {
    return false;
  }

  return ReferendumEvents.hasOwnProperty(method);
}

async function handleReferendumEvent(event, indexer, blockEvents) {
  const { section, method } = event;
  if (!isReferendumEvent(section, method)) {
    return;
  }

  if (ReferendumEvents.Started === method) {
    await handleStarted(...arguments);
  } else if (ReferendumEvents.Passed === method) {
    await handlePassed(...arguments);
  } else if (ReferendumEvents.Cancelled === method) {
    await handleCancelled(...arguments);
  } else if (ReferendumEvents.Executed === method) {
    await handleExecuted(event, indexer);
  } else if (ReferendumEvents.NotPassed === method) {
    await handleNotPassed(...arguments);
  }
}

module.exports = {
  handleReferendumEvent,
}
