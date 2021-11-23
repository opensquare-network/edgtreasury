require("dotenv").config();

const { getBlockIndexer } = require("./business/common/block/getBlockIndexer");
const { getApi } = require("./chain/api");
const { scanNormalizedBlock } = require("./scan/block");
const { setSpecHeights } = require("./chain/specs");

async function test() {
  const blockHeights = [
    1
  ];

  for (const height of blockHeights) {
    await setSpecHeights([height]);

    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);
    const indexer = getBlockIndexer(block.block);

    const seats = await scanNormalizedBlock(block.block, allEvents, indexer);
    console.log(seats)
    console.log('finished')
  }
}

test();
