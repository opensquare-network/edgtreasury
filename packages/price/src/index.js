const dotenv = require("dotenv");
dotenv.config();

const dayjs = require("dayjs");
const {getKlines} = require("./coinGecko");
const {getEdgUsdtCollection} = require("./mongo");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function saveKlines(col, klines) {

  if (klines?.prices && klines?.prices?.length > 0) {
    const bulk = col.initializeUnorderedBulkOp();
    for (const item of klines.prices) {
      const [
        openTime,
        open,
      ] = item;

      bulk.insert({
        openTime,
        open,
      });
    }

    await bulk.execute();
  }
}

async function tick() {
  const col = await getEdgUsdtCollection();

  const latestItem = (
    await col.find({}).sort({openTime: -1}).limit(1).toArray()
  )[0];
  let klines;
  if (latestItem) {
    const nextStartTime = ((latestItem.openTime + 1000) / 1000).toFixed(0);
    klines = await getKlines(nextStartTime);
    console.log('get kline points', klines?.prices?.length ?? 0);
  } else {
    klines = await getKlines();
  }

  await saveKlines(col, klines);

  return klines?.[klines.length - 1]?.[0] || latestItem?.openTime;
}

async function main() {
  while (true) {
    let latestOpenTime = null;

    try {
      latestOpenTime = await tick();
      console.log(latestOpenTime)
      console.log(
        `EDG price saved: ${dayjs(latestOpenTime).format(
          "YYYY-MM-DD HH:mm:ss"
        )}`
      );
    } catch (e) {
      console.error(e.message);
    }

    // Reduce the call rate when the latest open time is very close to the current time,
    if (
      latestOpenTime &&
      dayjs(latestOpenTime).add(5, "m").toDate().getTime() > Date.now()
    ) {
      await sleep(60 * 1000);
    } else {
      await sleep(2 * 1000);
    }
  }
}

main().catch(console.error);
