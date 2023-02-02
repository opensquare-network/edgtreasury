const { Modules, TreasuryRewardEvents } = require("../common/constants");

async function handleMinting(event, indexer,) {
  const { section, method, } = event;
  if (section !== Modules.TreasuryReward || TreasuryRewardEvents.TreasuryMinting !== method) {
    return 0;
  }

  if (indexer.blockHeight <= 3139200) {
    return event.data[1].toString()
  }

  if (indexer.blockHeight < 4953600) {
    return "95000000000000000000";
  }

  if (indexer.blockHeight < 6019200) {
    return "62000000000000000000";
  }

  return "0";
}

module.exports = {
  handleMinting,
}
