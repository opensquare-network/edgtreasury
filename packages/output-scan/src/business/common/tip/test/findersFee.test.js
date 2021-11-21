const { getTipFindersFeeFromApi } = require("../utils");
const { setSpecHeights } = require("../../../../chain/specs");
const { setApi } = require("../../../../chain/api");

async function testGetTipFindersFee(api, height, target) {
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const fee = await getTipFindersFeeFromApi(blockHash);

  expect(fee).toEqual(target);
}

describe("test get tip", () => {
  let api;

  beforeAll(async () => {
    api = await setApi();
  });

  afterAll(async () => {
    await api.disconnect();
  });

  test("getTipFindersFeeFromApi works", async () => {
    const data = [
      [1223173, 20],
    ]

    for (const item of data) {
      setSpecHeights([item[0]]);
      await testGetTipFindersFee(api, item[0], item[1]);
    }
  })
})
