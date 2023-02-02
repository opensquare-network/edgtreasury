const { hexToU8a } = require("@polkadot/util");
const { normalizeCall } = require("../../call/normalize");
const { chain: { findBlockApi, findRegistry } } = require("@osn/scan-common");

async function queryImageCall(imageHash, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.democracy.preimages(imageHash);
  if (!raw.isSome) {
    return null;
  }

  let availableImage;
  if (raw.value && Array.isArray(raw.value)) {
    availableImage = {
      data: raw.value[0].toJSON(),
      provider: raw.value[1].toJSON(),
      deposit: raw.value[2].toString(),
      since: raw.value[3].toJSON(),
    }
  } else {
    availableImage = raw.unwrap().asAvailable.toJSON();
  }

  const registry = await findRegistry(indexer);

  try {
    return registry.createType("Proposal", availableImage.data);
  } catch (e) {
    return null
  }
}

async function getPreImageFromStorage(imageHash, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.democracy.preimages(imageHash);
  if (!raw.isSome) {
    return {};
  }

  let availableImage;
  if (raw.value && Array.isArray(raw.value)) {
    availableImage = {
      data: raw.value[0].toJSON(),
      provider: raw.value[1].toJSON(),
      deposit: raw.value[2].toString(),
      since: raw.value[3].toJSON(),
    }
  } else {
    availableImage = raw.unwrap().asAvailable.toJSON();
  }

  const registry = await findRegistry(indexer);
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
  queryImageCall,
  getPreImageFromStorage,
};
