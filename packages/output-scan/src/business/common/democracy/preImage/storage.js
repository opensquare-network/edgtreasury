const { findDecorated } = require("../../../../chain/specs");
const { findRegistry } = require("../../../../chain/specs");
const { hexToU8a } = require("@polkadot/util");
const { getApi } = require("../../../../chain/api");
const { normalizeCall } = require("../../call/normalize");

async function queryImageCall(imageHash, indexer) {
  const decorated = await findDecorated(indexer.blockHeight);
  const key = [decorated.query.democracy.preimages, imageHash];

  const api = await getApi();
  const raw = await api.rpc.state.getStorage(key, indexer.blockHash);
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

  const registry = await findRegistry(indexer.blockHeight);

  try {
    return registry.createType("Proposal", availableImage.data);
  } catch (e) {
    return null
  }
}

async function getPreImageFromStorage(imageHash, indexer) {
  const decorated = await findDecorated(indexer.blockHeight);
  const key = [decorated.query.democracy.preimages, imageHash];

  const api = await getApi();
  const raw = await api.rpc.state.getStorage(key, indexer.blockHash);
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
  queryImageCall,
  getPreImageFromStorage,
};
