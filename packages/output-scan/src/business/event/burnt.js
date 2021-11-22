const {
  Modules,
  TreasuryCommonEvent,
} = require("../common/constants");
const { getBurntCollection } = require("../../mongo");
const { getTreasuryBalance } = require("../common/balance/freeBalance");
const { getMetadataConstByBlockHash } = require("../common/metadata/const");

async function getBurnPercent(blockHash) {
  const v = await getMetadataConstByBlockHash(blockHash, "Treasury", "Burn");
  return v ? v.toHuman() : v;
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
