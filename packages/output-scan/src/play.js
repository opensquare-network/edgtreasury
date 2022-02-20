require("dotenv").config();
const { setSpecHeights } = require("./chain/specs");
const { scanNormalizedBlock } = require("./scan/block");
const { getApi } = require("./chain/api")

async function test() {
  const blockHeights = [
    // 201600
    // 100800,
    // 8929639,
    // 8929603,
    // 8956800,
    // 9057600,
    // 9072000
    5007038,
    5555165,
    5555172,
    5561564,
    8535841,
    8539115
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
