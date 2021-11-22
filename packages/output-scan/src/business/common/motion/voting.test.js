const { setApi } = require("../../../chain/api");
const { setSpecHeights } = require("../../../chain/specs");
const {
  getMotionVoting,
} = require("./votingStorage");

jest.setTimeout(3000000);

describe("test get motion voting", () => {
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

    const voting = await getMotionVoting(indexer.blockHash, '0xd4361a70deafcadde8234a0c33ece2c81f5113912bd802d8916a59fa531ddec5');
    expect(voting).toEqual({
      "index": 26,
      "threshold": 8,
      "ayes": [
        "jKauGVPCQkteGTDKuuNwhYhMBrj5QuytgybEC4A5cS4Bki5"
      ],
      "nays": [],
      "end": 4429249
    });
  });
});
