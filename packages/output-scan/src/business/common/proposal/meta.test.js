const { setApi } = require("../../../chain/api");
const { setSpecHeights } = require("../../../chain/specs");
jest.setTimeout(3000000);

const { getTreasuryProposalMeta } = require("./meta");

async function testProposalData(api, height, proposalIndex, toTestMeta) {
  await setSpecHeights([height]);
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const meta = await getTreasuryProposalMeta(blockHash, proposalIndex);
  expect(meta).toEqual(toTestMeta);
}

describe("test get treasury proposal", () => {
  let api;

  beforeAll(async () => {
    api = await setApi();
  });

  afterAll(async () => {
    await api.disconnect();
  });

  test("meta works", async () => {
    await testProposalData(api, 17949, 0, null)

    await testProposalData(api, 5013103, 21, {
      "proposer": "jcE6HmvqtCJZf5aPeUhVCrp1VbFxhZkHNodXGZAbqUXRDNe",
      "value": "0x0000000000020e9ded301ba7feb80000",
      "beneficiary": "jcE6HmvqtCJZf5aPeUhVCrp1VbFxhZkHNodXGZAbqUXRDNe",
      "bond": "0x0000000000001a54b24267c866560000"
    })
  });
});
