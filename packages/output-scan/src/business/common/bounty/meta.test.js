const { getBountyDescription } = require("./description");
const { setApi } = require("../../../chain/api");
const { getBountyMeta } = require("./meta");
const { setSpecHeights } = require("../../../chain/specs");
jest.setTimeout(3000000);

async function testBountyData(api, height, bountyIndex, toTestMeta) {
  await setSpecHeights([height]);
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const meta = await getBountyMeta({
    blockHeight: height,
    blockHash
  }, bountyIndex);
  expect(meta).toEqual(toTestMeta);
}

async function testBountyDescription(api, height, bountyIndex, target) {
  await setSpecHeights([height]);
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const description = await getBountyDescription({
    blockHeight: height,
    blockHash
  }, bountyIndex)
  expect(description).toBe(target)
}

describe("test get treasury bounty", () => {
  let api;

  beforeAll(async () => {
    api = await setApi();
  });

  afterAll(async () => {
    await api.disconnect();
  });

  test("meta works", async () => {
    await testBountyData(api, 5007038, 0, {
      "proposer": "hwR8hAatmmdupBLXQSxLUPBa8GhRomLD9hf6iRtFeXs8fcY",
      "value": "0x0000000000000fe1c215e8f838e00000",
      "fee": 0,
      "curatorDeposit": 0,
      "bond": "0x000000000000000096285cac55ba0000",
      "status": {
        "Proposed": null
      }
    })

    await testBountyData(api, 8362827, 1, {
      "proposer": "jKauGVPCQkteGTDKuuNwhYhMBrj5QuytgybEC4A5cS4Bki5",
      "value": "0x00000000000069e10de76676d0800000",
      "fee": 0,
      "curatorDeposit": 0,
      "bond": "0x00000000000000009576b9f026f50000",
      "status": {
        "Proposed": null
      }
    })
  });

  test("description works", async () => {
    await testBountyDescription(api, 5007038, 0, "Create separate feature flagged runtimes for edgeware mainnet / beresheet / devnet");
    await testBountyDescription(api, 8362827, 1, "Upgrade EDG to ERUP4 (Wako) with latest fixes on EDG Main (See gov.edgewa.re)");
  })
});
