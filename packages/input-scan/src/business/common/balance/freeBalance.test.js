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
      // [86400, "13859914527849781333138037"],
      // [3139200, "382753888311959348866531548"],
      // [3139201, "22813915211675128273"],
      // [3139210, "22813966173646411232"],
      // [3200000, "23265504257691032267"],
      // [3300000, "24013740996548668539"],
      // [3500000, "25505016607447140084"],
      // [3600000, "26255409232789780615"],
      // [3625000, "26443706219308326420"],
      // [3640000, "26555074395080484959"],
      // [3643000, "26578665657931991766"],
      // [3643125, "26579373463088699530"],
      // [3643225, "26579798146182724188"],
      [3643230, "445937864734907139178372706"],
      [3643240, "445938814746827139318677838"],
      [3643250, "445939764746827139318677838"],
      [3643500, "445963514758827139458957022"],
      [3644000, "446011014788667140179279696"],
      [3645000, "446218102789893686642434733"],
      [3650000, "446804091781740084569953932"],
      [3700000, "453163372522679403680709651"],
      [3800000, "465909992869044984026107960"],
      [4000000, "481282511478200199843361977"],
      [9212914, "654169106521586812210740503"],
    ]

    for (const item of testArr) {
      await testTreasuryBalance(api, item[0], item[1])
    }
  })
})
