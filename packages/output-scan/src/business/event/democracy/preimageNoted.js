const { insertPreImage } = require("../../../mongo/service/democracyPreImage");
const { getPreImageFromStorage } = require("../../common/democracy/preImage/storage");

async function handlePreimageNoted(event, indexer, blockEvents, extrinsic) {
  const [hash] = event.data.toJSON()

  // todo: add hooks to connect image with treasury proposals
  const imageInfo = await getPreImageFromStorage(hash, indexer);
  const obj = {
    hash,
    ...imageInfo,
    indexer,
  };

  await insertPreImage(obj);
}

module.exports = {
  handlePreimageNoted,
}
