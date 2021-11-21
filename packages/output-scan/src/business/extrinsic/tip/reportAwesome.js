const {
  TipMethods,
  Modules,
} = require("../../common/constants");
const { handleNewTip } = require("./new");

async function handleReportAwesomeCall(call, author, indexer, events) {
  if (
    ![Modules.Treasury, Modules.Tips].includes(call.section) ||
    TipMethods.reportAwesome !== call.method
  ) {
    return;
  }

  await handleNewTip(...arguments, true);
}

module.exports = {
  handleReportAwesomeCall,
};
