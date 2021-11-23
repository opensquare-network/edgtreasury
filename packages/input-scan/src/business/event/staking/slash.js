const { getStakingSlashCollection } = require("../../../mongo/index");
const {
  Modules,
  StakingEvents,
} = require("../../common/constants")

async function handleSlashEvent(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort <= 0) {
    return '0';
  }

  const preEvent = blockEvents[sort - 1];
  const {
    event: { section, method, },
  } = preEvent;

  if (Modules.Staking !== section || StakingEvents.Slash !== method) {
    return '0';
  }

  const obj = {
    indexer,
    section,
    method,
    balance: event.data[0].toString(),
  }

  const col = await getStakingSlashCollection()
  await col.insertOne(obj);
  return obj.balance;
}

module.exports = {
  handleStakingSlashEvent: handleSlashEvent,
}
