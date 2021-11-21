const { setApi } = require("../../../../chain/api");
const { setSpecHeights } = require("../../../../chain/specs");
const { getTipReason } = require("../utils");
const { getTipMetaFromStorage } = require("../utils");
jest.setTimeout(3000000);

async function testTipReason(api, height, reasonHash, toTestReason) {
  await setSpecHeights([height]);
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const reason = await getTipReason(
    blockHash,
    reasonHash,
  );
  expect(reason).toEqual(toTestReason);
}

async function testTipData(api, height, hash, toTestMeta) {
  await setSpecHeights([height]);
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const meta = await getTipMetaFromStorage(blockHash, hash);
  expect(meta).toEqual(toTestMeta);
}

describe("test get tip", () => {
  let api;

  beforeAll(async () => {
    api = await setApi();
  });

  afterAll(async () => {
    await api.disconnect();
  });

  test("meta works", async () => {
    await testTipData(api, 1223173, "0x9c88c5683f35014452f9625b1fba14895573751aea56df4de417960246cc1787", {
      "reason": "0x4a5e9e37117955c85f76bf4ab370e289001d7a1ba0cb1ada6b51349e44ea767c",
      "who": "n5wjtDexXJ2zbBq9R3aB1mxfdQtroHCd23v7ZUhKwiMeET7",
      "finder": null,
      "closes": null,
      "tips": [
        [
          "hwR8hAatmmdupBLXQSxLUPBa8GhRomLD9hf6iRtFeXs8fcY",
          "0x000000000000152d02c7e14af6800000"
        ]
      ]
    })

    await testTipData(api, 7370984, "0xbba8673e376241bdd399e43c0edfcb1ee5a98838ac85c6c04f01e64ee7d42600", {
      "reason": "0x322848215f21defa084ca8b65576d7a95384938a915f88593874ab3684ac5d1d",
      "who": "hX8eTbsDWPsEtoWBSjMBmRg3xXkhd2zxVAoBfGjhp57VPtm",
      "finder": "hX8eTbsDWPsEtoWBSjMBmRg3xXkhd2zxVAoBfGjhp57VPtm",
      "deposit": "0x000000000000000010ee4f8941fa0000",
      "closes": null,
      "tips": [
        [
          "jA7pLH65zgRNA4UgwqHEWWRxTgg51wuAUgfzmZoYWM2dMVS",
          "0x000000000000152d02c7e14af6800000"
        ]
      ],
      "findersFee": true
    })

    await testTipData(api, 8920402, "0x2b51e94198d506ae30061da2d1b171dcc021ae02676b6541d26b466318d19da8", {
      "reason": "0x77cf92664ba79b27fb5b8a85cd0242af89038f659c388e78da35a3ebbb1439dc",
      "who": "mae7JWE1EEMLcno2ZSB8dahwPqVPEyh8zik6dgNpQTvvucq",
      "finder": "jA7pLH65zgRNA4UgwqHEWWRxTgg51wuAUgfzmZoYWM2dMVS",
      "deposit": 0,
      "closes": null,
      "tips": [
        [
          "jA7pLH65zgRNA4UgwqHEWWRxTgg51wuAUgfzmZoYWM2dMVS",
          "0x0000000000003f870857a3e0e3800000"
        ]
      ],
      "findersFee": false
    })
  });

  test("reason works", async () => {
    // await testTipReason(
    //   api,
    //   2126182,
    //   "0xb5d701ab18839e66ceb5e4e1fd673d41addc622f7b5ffb0985ee051ab8c43b8c",
    //   "Keygen updates, EVM explorers by Raymond/ PicoSwap",
    // )

    await testTipReason(api, 8920402,
      "0x77cf92664ba79b27fb5b8a85cd0242af89038f659c388e78da35a3ebbb1439dc",
      "Keygen updates, EVM explorers by Raymond/ PicoSwap",
    )
  });
});
