require("dotenv").config();

const { getProposalCollection } = require("../mongo");
const { getLinkCollection, getDescriptionCollection } = require("../mongo-admin");

const migrateLink = async () => {
  try {
    console.log(`link migration start`);
    const proposalCol = await getProposalCollection();
    const linkCol = await getLinkCollection();
    const proposalLinks = await linkCol
      .find({
        "indexer.type": "proposal",
      })
      .toArray();
    await Promise.all(
      proposalLinks.map(async (item) => {
        await proposalCol.updateOne(
          {
            proposalIndex: item.indexer.index,
          },
          {
            $set: { links: item.links },
          }
        );
      })
    );
    console.log(`link migration success`);
  } catch (err) {
    console.log(`link migration error`, err);
  }
};

const migrateDescription = async () => {
  try {
    console.log(`description migration start`);
    const proposalCol = await getProposalCollection();
    const descriptionCol = await getDescriptionCollection();
    const descriptions = await descriptionCol
      .find({
        "indexer.type": "proposal",
      })
      .toArray();
    await Promise.all(
      descriptions.map(async (item) => {
        await proposalCol.updateOne(
          {
            proposalIndex: item.indexer.index,
          },
          {
            $set: { description: item.description },
          }
        );
      })
    );
    console.log(`description migration success`);
  } catch (err) {
    console.log(`description migration error`, err);
  }
};

(async () => {
  await migrateLink("edgeware");
  await migrateDescription("edgeware");
  process.exit(0);
})();
