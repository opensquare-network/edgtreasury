const { handlePreimageNoted } = require("./preimageNoted");
const { Modules, DemocracyEvents, } = require("../../common/constants");

async function handleDemocracyEvents(event, indexer, events, extrinsic) {
  const { section, method } = event;

  if (Modules.Democracy !== section || !DemocracyEvents.hasOwnProperty(method)) {
    return;
  }

  if (DemocracyEvents.PreimageNoted === method) {
    await handlePreimageNoted(event, indexer, events, extrinsic)
  }
}

module.exports = {
  handleDemocracyEvents,
}
