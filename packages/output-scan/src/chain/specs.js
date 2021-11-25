const findLast = require("lodash.findlast");
const { getScanHeight } = require("../mongo/meta");
const { getApi } = require("./api");
const { getAllVersionChangeHeights } = require("../mongo/meta");
const { expandMetadata } = require("@polkadot/metadata");

let versionChangedHeights = [];
let registryMap = {};
let decoratedMap = {};
let metaScanHeight = 1;

function getMetaScanHeight() {
  return metaScanHeight;
}

// For test
function setSpecHeights(heights = []) {
  versionChangedHeights = heights;
}

async function updateSpecs() {
  versionChangedHeights = await getAllVersionChangeHeights();
  metaScanHeight = await getScanHeight();
}

function getSpecHeights() {
  return versionChangedHeights;
}

async function getMetadataByHeight(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);

  return api.rpc.state.getMetadata(blockHash);
}

async function findDecorated(height) {
  const mostRecentChangeHeight = findLast(
    versionChangedHeights,
    (h) => h <= height
  );
  if (!mostRecentChangeHeight) {
    throw new Error(`Can not find height ${height}`);
  }

  let decorated = decoratedMap[mostRecentChangeHeight];
  if (!decorated) {
    const metadata = await getMetadataByHeight(height);
    const registry = await findRegistry(height);
    decorated = expandMetadata(registry, metadata);
    decoratedMap[height] = decorated;
  }

  return decorated;
}

async function findRegistry(height) {
  const mostRecentChangeHeight = findLast(
    versionChangedHeights,
    (h) => h <= height
  ) + 1;
  if (!mostRecentChangeHeight) {
    throw new Error(`Can not find registry for height ${height}`);
  }

  let registry = registryMap[mostRecentChangeHeight];
  if (!registry) {
    const api = await getApi()
    const blockHash = await api.rpc.chain.getBlockHash(mostRecentChangeHeight);
    const versionedRegistry = await api.getBlockRegistry(blockHash);
    registry = versionedRegistry.registry;
    registryMap[mostRecentChangeHeight] = registry;
  }

  return registry;
}


module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
  findDecorated,
  setSpecHeights,
  getMetaScanHeight,
};
