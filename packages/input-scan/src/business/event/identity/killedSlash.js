const { getIdentitySlashCollection } = require("../../../mongo/index");
const {
  Modules,
  IdentityEvents,
} = require("../../common/constants");

async function handleIdentityKilledSlash(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort >= blockEvents.length - 1) {
    return 0;
  }

  const nextEvent = blockEvents[sort + 1];
  const {
    event: { section, method, data, },
  } = nextEvent;
  if (section !== Modules.Identity || method !== IdentityEvents.IdentityKilled) {
    return 0;
  }

  const obj = {
    indexer,
    section,
    method,
    killedAccount: data[0].toString(),
    balance: data[1].toString(),
  }

  const col = await getIdentitySlashCollection()
  await col.insertOne(obj);
  return obj.balance;
}

module.exports = {
  handleIdentityKilledSlash,
}
