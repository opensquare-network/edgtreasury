const { getBountyCollection } = require("../index");

async function insertBounty(bountyObj) {
  const col = await getBountyCollection();
  const { bountyIndex } = bountyObj;
  const maybeInDb = await col.findOne({ bountyIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(bountyObj);
}

async function getBounty(bountyIndex) {
  const col = await getBountyCollection();
  return await col.findOne({ bountyIndex });
}

async function updateBounty(bountyIndex, updates, timelineItem, motionInfo) {
  const col = await getBountyCollection();
  let update = {
    $set: updates,
  };

  if (timelineItem) {
    update = {
      ...update,
      $push: { timeline: timelineItem },
    };
  }

  if (motionInfo) {
    update = {
      ...update,
      $push: { motions: motionInfo }
    }
  }

  await col.updateOne({ bountyIndex }, update);
}


module.exports = {
  insertBounty,
  getBounty,
  updateBounty,
}
