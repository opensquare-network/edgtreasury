const endpoint = process.env.WS_ENDPOINT || 'wss://mainnet.edgewa.re';
const scanStep = parseInt(process.env.SCAN_STEP) || 100;
const useMetaDb = !!process.env.USE_META;

function getEndpoint() {
  return endpoint
}

function getScanStep() {
  return scanStep;
}

function isUseMetaDb() {
  return useMetaDb;
}

module.exports = {
  getEndpoint,
  getScanStep,
  isUseMetaDb,
}
