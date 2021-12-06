const { getEdgUsdtCollection } = require("../mongo");

async function getPrice(time) {
  const priceCol = await getEdgUsdtCollection();
  const [price] = await priceCol
    .find({
      $and: [
        { openTime: { $lte: time } },
        { openTime: { $gt: time - 3*24*3600*1000 } },
      ]
    })
    .sort({ openTime: -1 })
    .limit(1)
    .toArray();

  if (price) {
    return price.open;
  }

  return null;
}

module.exports = {
  getPrice,
};
