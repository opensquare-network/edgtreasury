require("dotenv").config();

const { subscribeChainHeight } = require("./chain/latestHead");

async function main() {
  await subscribeChainHeight();
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
