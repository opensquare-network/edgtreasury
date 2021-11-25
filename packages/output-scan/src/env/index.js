const endpoint = process.env.WS_ENDPOINT || 'wss://mainnet.edgewa.re';
const scanStep = parseInt(process.env.SCAN_STEP) || 100;
const useMetaDb = !!process.env.USE_META;
const useKnownHeights = !!process.env.USE_KNOWN_HEIGHTS;

function getEndpoint() {
  return endpoint
}

function getScanStep() {
  return scanStep;
}

function isUseMetaDb() {
  return useMetaDb;
}

function firstScanKnowHeights() {
  return useKnownHeights;
}

module.exports = {
  getEndpoint,
  getScanStep,
  isUseMetaDb,
  firstScanKnowHeights,
}
