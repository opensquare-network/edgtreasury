const { getStatusCollection, getOutputStatusCollection } = require("../../mongo");

async function getChainScanHeight() {
  const statusCol = await getStatusCollection();
  const outputStatusCol = await getOutputStatusCollection()
  const output = await outputStatusCol.find({}).toArray();
  const income = await statusCol.find({}).toArray();

  const incomeScan = (income || []).find(item => item.name === 'income-scan');
  const outScan = (output || []).find(item => item.name === 'output-scan');
  return {
    income: incomeScan.height,
    output: outScan.value,
  }
}

class ScanController {
  async getStatus(ctx) {
    const result = await getChainScanHeight();
    ctx.body = result;
  }
}

module.exports = new ScanController();
