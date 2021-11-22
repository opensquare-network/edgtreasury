const { getBlockIndexerByHeight } = require("./chain");
const { calcOutput } = require("./calc");
const {
  getBurntCollection,
  getBountyCollection,
  getTipCollection,
  getProposalCollection,
  getStatusCollection,
  getWeeklyStatsCollection,
} = require("../mongo");

const lastStatsHeight = "last-output-stats-height";

const oneHour = 3600;
const oneWeek = oneHour * 24 * 7;
const weeklyBlocks = oneWeek / 6;

async function getNextStatHeight() {
  const statusCol = await getStatusCollection();
  const heightInfo = await statusCol.findOne({ name: lastStatsHeight });

  if (!heightInfo) {
    return 1;
  } else if (typeof heightInfo.value === "number") {
    return heightInfo.value + weeklyBlocks;
  } else {
    console.error("Stat height value error in DB!");
    process.exit(1);
  }
}

async function updateStatHeight(height) {
  const statusCol = await getStatusCollection();
  await statusCol.findOneAndUpdate(
    { name: lastStatsHeight },
    { $set: { value: height } },
    { upsert: true }
  );
}

async function calcOutputStats() {
  const proposalCol = await getProposalCollection();
  const proposals = await proposalCol
    .find({}, { value: 1, beneficiary: 1, meta: 1, state: 1 })
    .toArray();

  const tipCol = await getTipCollection();
  const tips = await tipCol
    .find({}, { finder: 1, medianValue: 1, state: 1 })
    .toArray();

  const bountyCol = await getBountyCollection();
  const bounties = await bountyCol.find({}, { meta: 1, state: 1 }).toArray();

  const burntCol = await getBurntCollection();
  const burntList = await burntCol.find({}, { balance: 1 }).toArray();

  return calcOutput(proposals, tips, bounties, burntList);
}

async function tryCreateStatPoint(nextBlockIndexer) {
  while (true) {
    const nextStatHeight = await getNextStatHeight();

    if (nextBlockIndexer.blockHeight <= nextStatHeight) {
      return;
    }

    const indexer = await getBlockIndexerByHeight(nextStatHeight);
    const output = await calcOutputStats();

    // Go on create one stat point
    const weeklyStatsCol = await getWeeklyStatsCollection();
    await weeklyStatsCol.updateOne(
      { indexer },
      {
        $set: {
          output,
        },
      },
      { upsert: true }
    );

    await updateStatHeight(nextStatHeight)
  }
}

module.exports = {
  tryCreateStatPoint,
};
