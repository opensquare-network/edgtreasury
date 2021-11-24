const { setApi } = require("../../../chain/api");
const { setSpecHeights } = require("../../../chain/specs");
jest.setTimeout(3000000);

const { getTreasuryProposalMeta } = require("./meta");

async function testProposalData(api, height, proposalIndex, toTestMeta) {
  await setSpecHeights([height]);
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const meta = await getTreasuryProposalMeta({
    blockHeight: height,
    blockHash
  }, proposalIndex);
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
    await testProposalData(api, 17949, 0, {
      "proposer": "mWfGoSmKy1NiWfsiEwtjnb9ZvQGuyjd5ewiZ8xNdCdtuMoR",
      "value": "0x00000000000000001bc16d674ec80000",
      "beneficiary": "nY8ym4bZJUdf2aazFkQBonFr9APJdciasfHJSEBp1ZkY2cv",
      "bond": "0x000000000000003635c9adc5dea00000"
    })

    await testProposalData(api, 5013103, 21, {
      "proposer": "jcE6HmvqtCJZf5aPeUhVCrp1VbFxhZkHNodXGZAbqUXRDNe",
      "value": "0x0000000000020e9ded301ba7feb80000",
      "beneficiary": "jcE6HmvqtCJZf5aPeUhVCrp1VbFxhZkHNodXGZAbqUXRDNe",
      "bond": "0x0000000000001a54b24267c866560000"
    })
  });
});
