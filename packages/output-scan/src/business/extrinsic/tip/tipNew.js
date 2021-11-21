const {
  TipMethods,
  Modules,
} = require("../../common/constants");
const { handleNewTip } = require("./new");

async function handleTipNewCall(call, author, indexer, events) {
  if (
    ![Modules.Treasury, Modules.Tips].includes(call.section) ||
    TipMethods.tipNew !== call.method
  ) {
    return;
  }

  await handleNewTip(...arguments)
}

module.exports = {
  handleTipNewCall,
};
