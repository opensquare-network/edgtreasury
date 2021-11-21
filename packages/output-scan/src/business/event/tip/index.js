const { updateTipWithTipClosed } = require("./closed");
const { updateTipWithTipSlashed } = require("./slashed");
const { updateTipWithTipRetracted } = require("./retracted");
const { updateTipWithClosing } = require("./closing");
const { Modules, TipEvents } = require("../../common/constants");

function isTipEvent(section, method) {
  if (![Modules.Treasury, Modules.Tips].includes(section)) {
    return false;
  }

  return TipEvents.hasOwnProperty(method);
}

async function handleTipEvent(event, indexer, events, extrinsic) {
  const { section, method, data } = event;
  if (!isTipEvent(section, method)) {
    return;
  }

  if (TipEvents.TipClosing === method) {
    const [hash] = data;
    await updateTipWithClosing(hash.toString(), indexer);
  } else if (TipEvents.TipClosed === method) {
    await updateTipWithTipClosed(event, extrinsic, indexer);
  } else if (TipEvents.TipRetracted === method) {
    await updateTipWithTipRetracted(event, extrinsic, indexer);
  } else if (TipEvents.TipSlashed === method) {
    await updateTipWithTipSlashed(event, indexer);
  }
}

module.exports = {
  handleTipEvent,
}
