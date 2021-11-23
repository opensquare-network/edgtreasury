const { setSpecHeights } = require("../../../chain/specs");
const { setApi } = require("../../../chain/api");
const { getTreasuryBalance } = require("./freeBalance");

jest.setTimeout(3000000);

async function testTreasuryBalance(api, height, targetBalance) {
  setSpecHeights([height])
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const balance = await getTreasuryBalance({
    blockHeight: height,
    blockHash
  });

  expect(balance).toBe(targetBalance);
}

describe("Getting balance of", () => {
  let api;

  beforeAll(async () => {
    api = await setApi("wss://edgeware.api.onfinality.io/public-ws");
  });

  afterAll(async () => {
    await api.disconnect();
  });

  test("works", async () => {
    const testArr = [
      [86400, "13859914527849781333138037"],
      [3139200, "382753888311959348866531548"],
      [3139201, "22813915211675128273"],
      [3139210, "22813966173646411232"],
      [9212914, "654169106521586812210740503"],
    ]

    for (const item of testArr) {
      await testTreasuryBalance(api, item[0], item[1])
    }
  })
})
