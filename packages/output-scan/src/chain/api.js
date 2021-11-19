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

module.exports = {
  getApi,
}
