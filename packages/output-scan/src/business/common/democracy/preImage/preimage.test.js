const { setApi } = require("../../../../chain/api");
const { getPreImageFromStorage } = require("./storage");
const { setSpecHeights } = require("../../../../chain/specs");
jest.setTimeout(3000000);

describe("test get proposal image", () => {
  let api;

  beforeAll(async () => {
    api = await setApi();
  });

  afterAll(async () => {
    await api.disconnect();
  });

  test(" works", async () => {
    const blockHeight = 8929603;
    setSpecHeights([blockHeight]);
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const hash =
      "0x6b62b9c6e012789cc98059d7cda7e2dcb4a907ce3cddab02c3192ad2f0d9bddf";
    const image = await getPreImageFromStorage(hash, indexer);
    expect(image).toEqual({
      "data": "0x0f02a0",
      "provider": "ks9tY4vnb5oEGsj5QyrJ1Z66ydjMbjhy623zMBdnCigfGAk",
      "deposit": "0x0000000000000000006a94d74f430000",
      "since": 8929603,
      "expiry": null,
      "imageValid": true,
      "call": {
        "callIndex": "0x0f02",
        "section": "treasury",
        "method": "approveProposal",
        "args": [
          {
            "name": "proposal_id",
            "type": "Compact<ProposalIndex>",
            "value": 40
          }
        ]
      }
    });
  });
});
