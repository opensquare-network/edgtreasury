require("dotenv").config();
const { getApi } = require("./chain/api")

async function test() {
  const blockHeights = [
    17949
  ];

  const api = await getApi();
  for (const height of blockHeights) {
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    console.log(block, allEvents);
    console.log('finished')
  }
}

test();
