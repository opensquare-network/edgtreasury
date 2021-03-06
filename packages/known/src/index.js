require("dotenv").config();
const { getDemocracyHeights } = require("./heights/democracy");
const { getWeeklyStatsHeights } = require("./heights/weeklyStats");
const { getBountyHeights } = require("./heights/bounty");
const { getMotionHeights } = require("./heights/motion");
const { closeKnownClient } = require("./mongo/knownHeight");
const { closeDataDbClient } = require("./mongo/data");
const { saveKnownHeights } = require("./mongo/service/known");
const { getProposalHeights } = require("./heights/proposal");
const { getBurntHeights } = require("./heights/burnt");
const { getTipHeights } = require("./heights/tip");
const { getOutTransferHeights } = require("./heights/outTransfer");

async function main() {
  const proposalHeights = await getProposalHeights();
  await saveKnownHeights(proposalHeights);

  const motionHeights = await getMotionHeights();
  await saveKnownHeights(motionHeights);

  const bountyHeights = await getBountyHeights();
  await saveKnownHeights(bountyHeights);

  const burntHeights = await getBurntHeights();
  await saveKnownHeights(burntHeights);

  const tipHeights = await getTipHeights();
  await saveKnownHeights(tipHeights);

  const outTransferHeights = await getOutTransferHeights();
  await saveKnownHeights(outTransferHeights);

  const weeklyStatsHeights = await getWeeklyStatsHeights();
  await saveKnownHeights(weeklyStatsHeights);

  const democracyHeights = await getDemocracyHeights();
  await saveKnownHeights(democracyHeights);
}

main()
  .then(async () => {
    console.log("Known heights saved")
    await closeDataDbClient();
    await closeKnownClient();
  })
  .catch(console.error)
