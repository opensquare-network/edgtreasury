const dotenv = require("dotenv");
dotenv.config();

const minimist = require("minimist");
const dayjs = require("dayjs");
const {getKlines} = require("./coinGecko");
const {getEdgUsdtCollection} = require("./mongo");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getCollection(symbol) {
  if (symbol === "EDG") {
    return getEdgUsdtCollection();
  } else {
    throw new Error("Unsupport symbol " + symbol);
  }
}

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

async function tick(symbol) {
  const col = await getCollection(symbol);

  const latestItem = (
    await col.find({}).sort({openTime: -1}).limit(1).toArray()
  )[0];
  let klines;
  if (latestItem) {
    const nextStartTime = ((latestItem.openTime + 1000) / 1000).toFixed(0);
    klines = await getKlines(symbol, nextStartTime);
    console.log('get kline points', klines?.prices?.length ?? 0);
  } else {
    klines = await getKlines(symbol);
  }

  await saveKlines(col, klines);

  return klines?.[klines.length - 1]?.[0] || latestItem?.openTime;
}

async function main() {
  const args = minimist(process.argv.slice(2));

  if (!args.symbol) {
    console.log("Must specify symbol with argument --symbol=[EDG]");
    return;
  }

  if (!["EDG"].includes(args.symbol)) {
    console.log(`Unknown symbol "${args.symbol}"`);
    return;
  }

  while (true) {
    let latestOpenTime = null;

    try {
      latestOpenTime = await tick(args.symbol);
      console.log(latestOpenTime)
      console.log(
        `${args.symbol} price saved: ${dayjs(latestOpenTime).format(
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
