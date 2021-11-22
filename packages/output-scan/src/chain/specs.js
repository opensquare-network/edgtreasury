const findLast = require("lodash.findlast");
const { getApi } = require("./api");
const { getAllVersionChangeHeights } = require("../mongo/meta");

let versionChangedHeights = [];
let registryMap = {};

// For test
function setSpecHeights(heights = []) {
  versionChangedHeights = heights;
}

async function updateSpecs() {
  versionChangedHeights = await getAllVersionChangeHeights();
}

function getSpecHeights() {
  return versionChangedHeights;
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
  setSpecHeights,
};
