const { queryCurrentPayout } = require("./payout");
const { setSpecHeights } = require("../../../chain/specs");
const { setApi } = require("../../../chain/api");

jest.setTimeout(3000000);

async function testPayout(api, height, testValue) {
  setSpecHeights([height])
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const payout = await queryCurrentPayout(blockHash);
  expect(payout).toEqual(testValue);
}

describe("Getting treasury reward current payout", () => {
  let api;

  beforeAll(async () => {
    api = await setApi("wss://edgeware.api.onfinality.io/public-ws");
  });

  afterAll(async () => {
    await api.disconnect();
  });

  test("works", async () => {
    const testData = [
      [1, "95000000000000000000"],
      [3139219, "95000000000000000000"],
      [3139201, "95000000000000000000"],
      [4953600, "62000000000000000000"],
      [6019200, "0"],
    ];

    for (const data of testData) {
      await testPayout(api, data[0], data[1]);
    }
  })
})
