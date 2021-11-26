const { MongoClient } = require("mongodb");

const dbName = process.env.MONGO_DB_PRICE_NAME || "price";

const edgUsdtCollectionName = "edgUsdt";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let edgUsdtCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(dbName);
  edgUsdtCol = db.collection(edgUsdtCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  edgUsdtCol.createIndex({ openTime: 1 });
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getEdgUsdtCollection() {
  await tryInit(edgUsdtCol);
  return edgUsdtCol;
}

module.exports = {
  initDb,
  getEdgUsdtCollection,
};
