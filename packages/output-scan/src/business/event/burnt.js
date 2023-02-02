const {
  Modules,
  TreasuryCommonEvent,
} = require("../common/constants");
const { getBurntCollection } = require("../../mongo");
const { getTreasuryBalance } = require("../common/balance/freeBalance");
const { chain: { findBlockApi } } = require("@osn/scan-common");

async function getBurnPercent(blockHash) {
  const blockApi = await findBlockApi(blockHash);
  return blockApi.consts.treasury?.burn.toHuman()
}

async function handleBurntEvent(event, eventIndexer) {
  const { section, method, data } = event;
  if (Modules.Treasury !== section || TreasuryCommonEvent.Burnt !== method) {
    return false;
  }

  const balance = data[0].toString()
  const treasuryBalance = await getTreasuryBalance(eventIndexer);
  const burnPercent = await getBurnPercent(eventIndexer.blockHash);

  const burntCol = await getBurntCollection();
  await burntCol.insertOne({
    indexer: eventIndexer,
    balance,
    treasuryBalance,
    burnPercent,
  });
}


module.exports = {
  handleBurntEvent,
};
