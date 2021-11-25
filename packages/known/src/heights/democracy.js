const {
  getDemocracyPreImageCollection,
  getDemocracyReferendumCollection,
} = require("../mongo/data");

async function getDemocracyHeights() {
  const imageCol = await getDemocracyPreImageCollection()
  const imageRecords = await imageCol.find({}).toArray();

  const heights = [];
  for (const record of imageRecords) {
    heights.push(record.indexer.blockHeight)
  }

  const referendumCol = await getDemocracyReferendumCollection();
  const referendumRecords = await referendumCol.find({}).toArray();
  for (const record of referendumRecords) {
    (record.timeline || []).map(item => {
      const indexer = item.indexer || item.extrinsicIndexer || item.eventIndexer;
      heights.push(indexer.blockHeight);
    })
  }

  return [...new Set(heights)]
}

module.exports = {
  getDemocracyHeights,
}
