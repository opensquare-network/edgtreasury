import { ApiPromise, WsProvider } from "@polkadot/api";
import { isWeb3Injected, web3FromAddress } from "@polkadot/extension-dapp";
import { stringToHex, BN, BN_THOUSAND, BN_TWO, bnToBn } from "@polkadot/util";
import { encodeAddress } from "@polkadot/keyring";
import { spec } from "@edgeware/node-types";

import {
  DEFAULT_EDGEWARE_NODE_URL,
  DEFAULT_EDGEWARE_NODES,
} from "../constants";

const apiInstanceMap = new Map();

let nodeUrl = (() => {
  let localNodeUrl = null;
  try {
    localNodeUrl = JSON.parse(localStorage.getItem("nodeUrl"));
  } catch (e) {
    // ignore parse error
  }
  return {
    edgeware:
      DEFAULT_EDGEWARE_NODES.find((item) => item.url === localNodeUrl?.edgeware)
        ?.url || DEFAULT_EDGEWARE_NODE_URL,
  };
})();

export const getNodeUrl = () => nodeUrl;

export const getNodes = () => ({
  edgeware: DEFAULT_EDGEWARE_NODES,
});

export const getApi = async (queryUrl) => {
  const url = queryUrl || nodeUrl?.edgeware;
  if (!apiInstanceMap.has(url)) {
    apiInstanceMap.set(
      url,
      ApiPromise.create({ provider: new WsProvider(url), typesBundle: spec.typesBundle })
    );
  }
  return apiInstanceMap.get(url);
};

export const getTipCountdown = async () => {
  const api = await getApi();
  return api.consts.tips.tipCountdown.toNumber();
};

export const signMessage = async (text, address) => {
  if (!isWeb3Injected || !address) {
    return "";
  }

  const injector = await web3FromAddress(address);

  const data = stringToHex(text);
  const result = await injector.signer.signRaw({
    type: "bytes",
    data,
    address,
  });

  return result.signature;
};

const extractBlockTime = (extrinsics) => {
  const setTimeExtrinsic = extrinsics.find(
    (ex) => ex.method.section === "timestamp" && ex.method.method === "set"
  );
  if (setTimeExtrinsic) {
    const { args } = setTimeExtrinsic.method.toJSON();
    return args.now;
  }
};

export const getBlockTime = async (number) => {
  const api = await getApi();
  const hash = await api.rpc.chain.getBlockHash(number);
  const block = await api.rpc.chain.getBlock(hash);
  const time = extractBlockTime(block.block.extrinsics);
  return time;
};

const DEFAULT_TIME = new BN(6_000);
const THRESHOLD = BN_THOUSAND.div(BN_TWO);

export const estimateBlocksTime = async (blocks) => {
  const api = await getApi();
  const blockTime = (
    // Babe
    api.consts.babe?.expectedBlockTime ||
    // POW, eg. Kulupu
    api.consts.difficulty?.targetBlockTime ||
    // Subspace
    api.consts.subspace?.expectedBlockTime || (
      // Check against threshold to determine value validity
      api.consts.timestamp?.minimumPeriod.gte(THRESHOLD)
        // Default minimum period config
        ? api.consts.timestamp.minimumPeriod.mul(BN_TWO)
        : api.query.parachainSystem
          // default guess for a parachain
          ? DEFAULT_TIME.mul(BN_TWO)
          // default guess for others
          : DEFAULT_TIME
    )
  );
  const value = blockTime.mul(bnToBn(blocks)).toNumber();
  return value;
};

export const encodeKusamaAddress = (address) => {
  try {
    return encodeAddress(address, 2);
  } catch {
    return "";
  }
};

export const encodePolkadotAddress = (address) => {
  try {
    return encodeAddress(address, 0);
  } catch {
    return "";
  }
};

export const encodeSubstrateAddress = (address) => {
  try {
    return encodeAddress(address, 42);
  } catch {
    return "";
  }
};
