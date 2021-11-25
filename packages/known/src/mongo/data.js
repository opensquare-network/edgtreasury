const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_DB_NAME
  if (!dbName) {
    throw new Error("no MONGO_DB_NAME set")
  }

  return dbName;
}

const tipCollectionName = "tip";
const motionCollectionName = "motion";
const bountyCollectionName = "bounty";
const proposalCollectionName = "proposal";
const burntCollectionName = "burnt";
const outTransferColName = "outputTransfer";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let tipCol = null;
let bountyCol = null;
let proposalCol = null;
let motionCol = null;
let burntCol = null;
let outTransferCol = null;
let preImageCol = null;
let democracyReferendumCol = null;

let weeklyStatsCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  const dbName = getDbName()
  console.log('dbName:', dbName);
  db = client.db(dbName);
  tipCol = db.collection(tipCollectionName);
  bountyCol = db.collection(bountyCollectionName);
  proposalCol = db.collection(proposalCollectionName);
  motionCol = db.collection(motionCollectionName);
  burntCol = db.collection(burntCollectionName);
  outTransferCol = db.collection(outTransferColName);
  preImageCol = db.collection("democracyPreImage");
  democracyReferendumCol = db.collection("democracyReferendum");

  weeklyStatsCol = db.collection("weeklyStats");

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  // TODO: create indexes for better query performance
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getMotionCollection() {
  await tryInit(motionCol);
  return motionCol;
}

async function getTipCollection() {
  await tryInit(tipCol);
  return tipCol;
}

async function getBountyCollection() {
  await tryInit(bountyCol);
  return bountyCol;
}

async function getProposalCollection() {
  await tryInit(proposalCol);
  return proposalCol;
}

async function getBurntCollection() {
  await tryInit(burntCol);
  return burntCol;
}

async function getOutTransferCollection() {
  await tryInit(outTransferCol);
  return outTransferCol;
}

async function getDemocracyPreImageCollection() {
  await tryInit(preImageCol);
  return preImageCol;
}

async function getDemocracyReferendumCollection() {
  await tryInit(democracyReferendumCol);
  return democracyReferendumCol;
}

async function getWeeklyStatsCollection() {
  await tryInit(weeklyStatsCol);
  return weeklyStatsCol;
}

async function closeDataDbClient() {
  await client.close()
}

module.exports = {
  getTipCollection,
  getBountyCollection,
  getProposalCollection,
  getMotionCollection,
  getBurntCollection,
  getOutTransferCollection,
  closeDataDbClient,
  getDemocracyPreImageCollection,
  getDemocracyReferendumCollection,
  getWeeklyStatsCollection,
};
