const { getEdgUsdtCollection } = require("../mongo");

async function getPrice(time) {
  const priceCol = await getEdgUsdtCollection();
  const [price] = await priceCol
    .find({
      openTime: { $lte: time },
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
