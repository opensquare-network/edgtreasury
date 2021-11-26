const fetch = require("node-fetch");
const AbortController = require("abort-controller");

async function getKlines(symbol, startTime = '1582329600') {
  const url = new URL("/api/v3/coins/edgeware/market_chart/range", "https://api.coingecko.com");
  url.searchParams.set("vs_currency", `usd`);
  url.searchParams.set("from", `${startTime}`);
  url.searchParams.set("to", `${parseInt(startTime) + 7200}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 3000);

  try {
    const res = await fetch(url, {signal: controller.signal});
    const json = await res.json();
    return json;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("request was aborted");
    }
  } finally {
    clearTimeout(timeout);
  }

  return [];
}

module.exports = {
  getKlines,
};
