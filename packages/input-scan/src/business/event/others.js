const { getOthersIncomeCollection } = require("../../mongo/index");
const { gt } = require("../../utils");
const tooMuchGas = 10 * Math.pow(10, 18);

async function handleOthers(event, indexer) {
  const balance = event.data[0].toString();

  const obj = {
    indexer,
    balance,
  }

  if (gt(balance, tooMuchGas)) {
    const col = await getOthersIncomeCollection();
    await col.insertOne(obj);
  }

  return obj.balance;
}

module.exports = {
  handleOthers,
}
