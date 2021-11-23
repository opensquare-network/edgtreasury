const { queryMintingInterval } = require("./interval");
const { setSpecHeights } = require("../../../chain/specs");
const { setApi } = require("../../../chain/api");

jest.setTimeout(3000000);

describe("Getting treasury reward minting interval", () => {
  let api;

  beforeAll(async () => {
    api = await setApi("wss://edgeware.api.onfinality.io/public-ws");
  });

  afterAll(async () => {
    await api.disconnect();
  });

  test("works", async () => {
    const height = 3139219
    setSpecHeights([height])
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const interval = await queryMintingInterval(blockHash);
    expect(interval).toEqual(1);
  })
})
