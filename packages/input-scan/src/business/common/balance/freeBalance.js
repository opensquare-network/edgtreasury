const { edgTreasuryAccount } = require("../constants");
const {
  blake2AsU8a,
  decodeAddress,
  xxhashAsU8a,
} = require("@polkadot/util-crypto");
const { u8aToHex } = require("@polkadot/util");
const { chain: { findRegistry } } = require("@osn/scan-common");

let balanceKey = getFreeBalanceAccountKey(edgTreasuryAccount);

function getFreeBalanceAccountKey(address) {
  const section = xxhashAsU8a("Balances", 128);
  const method = xxhashAsU8a("Account", 128);

  const id = decodeAddress(address);
  const hash = blake2AsU8a(id, 256);

  return u8aToHex([...section, ...method, ...hash,]);
}

async function getBalance(indexer) {
  const api = await getApi();
  if (indexer.blockHeight <= 3139200) {
    const balancesValue = await api.rpc.state.getStorage(balanceKey, indexer.blockHash);
    const registry = await findRegistry(indexer);
    const accountData = registry.createType("AccountData", balancesValue.toHex(), true)
    return accountData.free.toString()
  }

  const accountInfo = await api.query.system.account.at(indexer.blockHash, edgTreasuryAccount);
  return accountInfo.data.free.toString();
}

module.exports = {
  getTreasuryBalance: getBalance,
};
