const endpoint = process.env.WS_ENDPOINT || 'wss://mainnet.edgewa.re';
const scanStep = parseInt(process.env.SCAN_STEP) || 100;

function getEndpoint() {
  return endpoint
}

function getScanStep() {
  return scanStep;
}

module.exports = {
  getEndpoint,
  getScanStep,
}
