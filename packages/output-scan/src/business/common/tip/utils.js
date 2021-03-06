const { findDecorated } = require("../../../chain/specs");
const { getMetadataConstByBlockHash, getMetadataConstsByBlockHash } = require("../metadata/const");
const { getApi } = require("../../../chain/api");
const {
  Modules,
  ProxyMethods,
  MultisigMethods,
  UtilityMethods,
  TipMethods,
} = require("../constants");
const { GenericCall } = require("@polkadot/types");
const { blake2AsHex } = require("@polkadot/util-crypto");
const { isHex, hexToString } = require("@polkadot/util");

async function getTipMetaFromStorage(indexer, tipHash) {
  const api = await getApi();
  const decorated = await findDecorated(indexer.blockHeight);
  let key;
  if (decorated.query.treasury?.tips) {
    key = [decorated.query.treasury?.tips, tipHash];
  } else {
    key = [decorated.query.tips?.tips, tipHash];
  }

  const rawMeta = await api.rpc.state.getStorage(key, indexer.blockHash);
  return rawMeta.toJSON();
}

async function getTipReason(indexer, reasonHash) {
  const api = await getApi();
  const decorated = await findDecorated(indexer.blockHeight);
  let key;
  if (decorated.query.treasury?.reasons) {
    key = [decorated.query.treasury?.tips, reasonHash];
  } else {
    key = [decorated.query.tips?.reasons, reasonHash];
  }

  const rawMeta = await api.rpc.state.getStorage(key, indexer.blockHash);
  const maybeTxt = rawMeta.toHuman();
  if (isHex(maybeTxt)) {
    return hexToString(maybeTxt);
  } else {
    return maybeTxt;
  }
}

function findNewTipCallFromProxy(registry, proxyCall, reasonHash) {
  const [, , innerCall] = proxyCall.args;
  return getNewTipCall(registry, innerCall, reasonHash);
}

function findNewTipCallFromMulti(registry, call, reasonHash) {
  const callHex = call.args[3];
  const innerCall = new GenericCall(registry, callHex);
  return getNewTipCall(registry, innerCall, reasonHash);
}

function findNewTipCallFromBatch(registry, call, reasonHash) {
  for (const innerCall of call.args[0]) {
    const call = getNewTipCall(registry, innerCall, reasonHash);
    if (call) {
      return call;
    }
  }

  return null;
}

function getNewTipCall(registry, call, reasonHash) {
  const { section, method, args } = call;
  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    return findNewTipCallFromProxy(registry, call, reasonHash);
  }

  if (Modules.Multisig === section || MultisigMethods.asMulti === method) {
    return findNewTipCallFromMulti(registry, call, reasonHash);
  }

  if (Modules.Utility === section && UtilityMethods.batch === method) {
    return findNewTipCallFromBatch(registry, call, reasonHash);
  }

  if (
    [Modules.Treasury, Modules.Tips].includes(section) &&
    [TipMethods.tipNew, TipMethods.reportAwesome].includes(method)
  ) {
    const hash = blake2AsHex(args[0]);
    if (hash === reasonHash) {
      return call;
    }
  }

  return null;
}

async function getTippersCountFromApi(blockHash) {
  const v = await getMetadataConstByBlockHash(
    blockHash,
    "Elections",
    "DesiredMembers"
  );
  return v ? v.toNumber() : v;
}

async function getTipFindersFeeFromApi(blockHash) {
  const constants = await getMetadataConstsByBlockHash(blockHash, [
    {
      moduleName: "Tips",
      constantName: "TipFindersFee",
    },
    {
      moduleName: "Treasury",
      constantName: "TipFindersFee",
    },
  ]);

  return (constants[0] ?? constants[1])?.toJSON();
}

module.exports = {
  getNewTipCall,
  getTipFindersFeeFromApi,
  getTipMetaFromStorage,
  getTipReason,
  getTippersCountFromApi,
};
