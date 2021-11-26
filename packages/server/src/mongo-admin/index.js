const { MongoClient } = require("mongodb");

const dbName = process.env.MONGO_ADMIN_DB_NAME || "edgtreasury-admin";

const linkCollectionName = "link";
const descriptionCollectionName = "description";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let linkCol = null;
let descriptionCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(dbName);
  linkCol = db.collection(linkCollectionName);
  descriptionCol = db.collection(descriptionCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }
  linkCol.createIndex({ indexer: 1 });
  descriptionCol.createIndex({ indexer: 1 });
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getLinkCollection() {
  await tryInit(linkCol);
  return linkCol;
}

async function getDescriptionCollection() {
  await tryInit(descriptionCol);
  return descriptionCol;
}

function withTransaction(fn, options) {
  return client.withSession((session) => {
    return session.withTransaction(fn, options);
  });
}

module.exports = {
  initDb,
  withTransaction,
  getLinkCollection,
  getDescriptionCollection,
};
