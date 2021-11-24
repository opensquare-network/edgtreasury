require("dotenv").config();
const { setSpecHeights } = require("./chain/specs");
const { scanNormalizedBlock } = require("./scan/block");
const { getApi } = require("./chain/api")

async function test() {
  const blockHeights = [
    8929639,
  ];

  setSpecHeights(blockHeights)

  const api = await getApi();
  for (const height of blockHeights) {
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    await scanNormalizedBlock(block.block, allEvents);
  }
  console.log('finished')
}

test();
