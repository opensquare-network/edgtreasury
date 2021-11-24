const { findRegistry } = require("../../../../chain/specs");
const { hexToU8a } = require("@polkadot/util");
const { getApi } = require("../../../../chain/api");
const { normalizeCall } = require("../../call/normalize");

async function getPreImageFromStorage(hash, indexer) {
  const api = await getApi();
  const raw = await api.query.democracy.preimages.at(indexer.blockHash, hash);
  if (!raw.isSome) {
    return {};
  }

  const availableImage = raw.unwrap().asAvailable.toJSON();
  const registry = await findRegistry(indexer.blockHeight);
  try {
    const call = registry.createType("Proposal", hexToU8a(availableImage.data));
    return {
      ...availableImage,
      imageValid: true,
      call: normalizeCall(call),
    };
  } catch (e) {
    return {
      ...availableImage,
      imageValid: false,
    };
  }
}

module.exports = {
  getPreImageFromStorage,
};
