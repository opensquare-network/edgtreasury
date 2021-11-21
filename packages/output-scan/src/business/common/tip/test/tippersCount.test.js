const { setSpecHeights } = require("../../../../chain/specs");
const { getTippersCountFromApi } = require("../utils");
const { setApi } = require("../../../../chain/api");

async function testTippersCount(api, height, target) {
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const tipperCount = await getTippersCountFromApi(blockHash);

  expect(tipperCount).toEqual(target);
}

describe("test get tip", () => {
  let api;

  beforeAll(async () => {
    api = await setApi();
  });

  afterAll(async () => {
    await api.disconnect();
  });

  test("getTippersCount works", async () => {
    const data = [
      [1223173, 13],
      // [9623456, 19]
    ]

    for (const item of data) {
      setSpecHeights([item[0]]);
      await testTippersCount(api, item[0], item[1]);
    }
  })
})
