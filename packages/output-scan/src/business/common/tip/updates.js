const { computeTipValue } = require("./median");
const { getTipFindersFeeFromApi } = require("./utils");
const { getTippersCountFromApi } = require("./utils");
const { getActiveTipByHash } = require("../../../mongo/service/tip");
const { getTipMetaFromStorage, } = require("./utils");
const BigNumber = require("bignumber.js")

async function getTipCommonUpdates(hash, { blockHeight, blockHash }) {
  const tipInDb = await getActiveTipByHash(hash);
  if (!tipInDb) {
    throw new Error(`can not find tip in db. hash: ${ hash }`);
  }

  const newMeta = await getTipMetaFromStorage({ blockHeight, blockHash }, hash);
  const meta = {
    ...tipInDb.meta,
    tips: newMeta.tips,
    closes: newMeta.closes,
  };
  const medianValue = new BigNumber(computeTipValue(newMeta)).toString();
  const tippersCount = await getTippersCountFromApi(blockHash);
  const tipFindersFee = await getTipFindersFeeFromApi(blockHash);

  return { medianValue, meta, tippersCount, tipFindersFee };
}

module.exports = {
  getTipCommonUpdates,
};
