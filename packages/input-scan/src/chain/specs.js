const findLast = require("lodash.findlast");
const { getScanHeight } = require("../mongo/meta");
const { getApi } = require("./api");
const { getAllVersionChangeHeights } = require("../mongo/meta");

let versionChangedHeights = [];
let registryMap = {};
let metaScanHeight = 1;

function getMetaScanHeight() {
  return metaScanHeight;
}

// For test
function setSpecHeights(heights = []) {
  versionChangedHeights = heights;
  metaScanHeight = heights[heights.length - 1];
}

async function updateSpecs() {
  versionChangedHeights = await getAllVersionChangeHeights();
  metaScanHeight = await getScanHeight();
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
  getMetaScanHeight,
};
