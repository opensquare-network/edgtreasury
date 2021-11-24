const { setSpecHeights } = require("../../../chain/specs");
const { setApi } = require("../../../chain/api");
const { getExternalFromStorage } = require("./external");

jest.setTimeout(3000000);

describe("test get external", () => {
  let api;

  beforeAll(async () => {
    api = await setApi();
  });

  afterAll(async () => {
    await api.disconnect();
  });

  test("works", async () => {
    // This external is created at 160503, when the 6th motion passed
    const height = 8956800;
    const preHeight = height - 1;
    const blockHash = await api.rpc.chain.getBlockHash(preHeight);
    setSpecHeights([preHeight]);

    const external = await getExternalFromStorage({
      blockHeight: preHeight,
      blockHash,
    });
    // Fast tracked by sudo(sudo)
    expect(external).toEqual([
      "0x6b62b9c6e012789cc98059d7cda7e2dcb4a907ce3cddab02c3192ad2f0d9bddf",
      "Simplemajority"
    ]);
  });
});
