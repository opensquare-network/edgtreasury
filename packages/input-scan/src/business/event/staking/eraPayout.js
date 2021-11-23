const { getIncomeInflationCollection } = require("../../../mongo/index");
const {
  Modules,
  StakingEvents,
} = require("../../common/constants");

async function handleEraPayout(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort <= 0 || sort >= blockEvents.length - 1) {
    return 0;
  }

  const preEvent = blockEvents[sort - 1];
  const {
    event: { section, method, },
  } = preEvent;
  if (section !== Modules.Staking || method !== StakingEvents.EraPayout) {
    return 0;
  }

  const balance = event.data[0].toString();

  const obj = {
    indexer,
    balance,
  }
  const col = await getIncomeInflationCollection();
  await col.insertOne(obj);
  return obj.balance;
}

module.exports = {
  handleEraPayout,
}
