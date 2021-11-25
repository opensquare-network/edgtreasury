const { getWeeklyStatsCollection } = require("../mongo/data");

async function getWeeklyStatsHeights() {
  const col = await getWeeklyStatsCollection()
  const records = await col.find({}).toArray();

  const heights = [];
  for (const record of records) {
    heights.push(record.indexer.blockHeight);
  }

  return [...new Set(heights)]
}

module.exports = {
  getWeeklyStatsHeights,
}
