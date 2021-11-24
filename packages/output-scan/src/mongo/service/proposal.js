const { getProposalCollection } = require("../index");

async function insertProposal(proposalObj) {
  const col = await getProposalCollection();
  const { proposalIndex } = proposalObj;
  const maybeInDb = await col.findOne({ proposalIndex });
  if (maybeInDb) {
    return;
  }

  await col.insertOne(proposalObj);
}

async function addProposalReferendum(proposalIndex, referendumInfo) {
  const col = await getProposalCollection();
  if (!referendumInfo) {
    return
  }

  const update = {
    $push: {
      referendums: referendumInfo
    }
  }

  await col.updateOne({ proposalIndex }, update);
}

async function addProposalExternalMotion(proposalIndex, externalMotion) {
  const col = await getProposalCollection();
  if (!externalMotion) {
    return
  }

  const update = {
    $push: {
      externalMotions: externalMotion
    }
  }

  await col.updateOne({ proposalIndex }, update);
}

async function updateProposal(proposalIndex, updates, timelineItem, motionInfo) {
  const col = await getProposalCollection();
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

  await col.updateOne({ proposalIndex }, update);
}

module.exports = {
  addProposalReferendum,
  addProposalExternalMotion,
  insertProposal,
  updateProposal,
};
