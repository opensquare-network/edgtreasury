const { setApi } = require("../../../chain/api");
const { setSpecHeights } = require("../../../chain/specs");
const { getMotionProposalCall } = require("./proposalStorage");

jest.setTimeout(3000000);

describe("test get motion proposal", () => {
  let api;

  beforeAll(async () => {
    api = await setApi();
  });

  afterAll(async () => {
    await api.disconnect();
  });

  test("works", async () => {
    const blockHeight = 4227649;
    await setSpecHeights([blockHeight]);
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const motionHash =
      "0xd4361a70deafcadde8234a0c33ece2c81f5113912bd802d8916a59fa531ddec5";

    const normalizedProposal = await getMotionProposalCall(motionHash, indexer);
    expect(normalizedProposal).toEqual({
      "callIndex": "0x0f02",
      "section": "treasury",
      "method": "approveProposal",
      "args": [
        {
          "name": "proposal_id",
          "type": "Compact<ProposalIndex>",
          "value": 17
        }
      ]
    });
  });
});
