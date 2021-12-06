const dotenv = require("dotenv");
dotenv.config();

const DB = require("./output-scan");
const { getPrice } = require("./price");

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const outDbName = process.env.MONGO_DB_OUTPUT_DB_NAME;
if (!outDbName) {
  console.log("MONGO_DB_OUTPUT_DB_NAME not set");
  process.exit(1);
}

const {
  getTipCollection,
  getProposalCollection,
  getBountyCollection,
} = DB(mongoUrl, outDbName);

async function savePrice(col) {
  const items = await col.find({}).toArray();

  for (const item of items) {
    const blockTime = item.indexer?.blockTime;
    if (blockTime) {
      const price = await getPrice(blockTime);
      if (price) {
        await col.updateOne(
          { _id: item._id },
          {
            $set: {
              symbolPrice: price,
            },
          }
        );
      }
    }
  }
}

async function main() {
  const tipCol = await getTipCollection();
  await savePrice(tipCol);

  const proposalCol = await getProposalCollection();
  await savePrice(proposalCol);

  const bountyCol = await getBountyCollection();
  await savePrice(bountyCol);

  console.log("Update price successful:", outDbName);
}

main().catch(console.error).then(() => process.exit(0));
