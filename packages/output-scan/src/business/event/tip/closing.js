const { updateTipByHash } = require("../../../mongo/service/tip");
const { getTipCommonUpdates } = require("../../common/tip/updates");

async function updateTipWithClosing(tipHash, indexer) {
  const updates = await getTipCommonUpdates(tipHash, indexer);
  await updateTipByHash(tipHash, updates);
}

module.exports = {
  updateTipWithClosing,
}
