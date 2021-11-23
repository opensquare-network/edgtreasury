const { getIncomeTransferCollection } = require("../../../mongo");
const {
  Modules,
  BalancesEvents,
  edgTreasuryAccount,
} = require("../../common/constants")

async function handleTransfer(event, indexer,) {
  const { section, method, } = event;
  if (section !== Modules.Balances || BalancesEvents.Transfer !== method) {
    return 0;
  }

  const [from, dest,] = event.data.toJSON()
  if (![edgTreasuryAccount].includes(dest)) {
    return 0;
  }

  const obj = {
    indexer,
    from,
    balance: event.data[2].toString(),
  };

  const col = await getIncomeTransferCollection()
  await col.insertOne(obj)

  return obj.balance;
}

module.exports = {
  handleTransfer,
}
