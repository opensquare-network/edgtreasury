const { getEndpoint } = require("../env");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { spec } = require("@edgeware/node-types")

let provider = null;
let api = null;

async function getApi() {
  if (!api) {
    provider = new WsProvider(getEndpoint(), 1000);

    api = await ApiPromise.create({ provider, typesBundle: spec.typesBundle, });
    console.log(`Connected to ${ getEndpoint() }`)
  }


  return api
}

// For test
async function setApi(endpoint = "wss://mainnet.edgewa.re") {
  if (!api) {
    provider = new WsProvider(endpoint, 1000);

    api = await ApiPromise.create({ provider, typesBundle: spec.typesBundle, });
    console.log(`Connected to ${ getEndpoint() }`)
  }

  return api
}

// for test
function setProvider(p) {
  provider = p;
}

// for test
function getProvider() {
  return provider;
}

module.exports = {
  getApi,
  setProvider,
  setApi,
}
