import { ApiPromise, WsProvider } from "@polkadot/api";
import { isWeb3Injected, web3FromAddress } from "@polkadot/extension-dapp";
import { stringToHex } from "@polkadot/util";
import { encodeAddress } from "@polkadot/keyring";
import { spec } from "@edgeware/node-types";

import {
  DEFAULT_KUSAMA_NODE_URL,
  DEFAULT_KUSAMA_NODES,
  DEFAULT_POLKADOT_NODE_URL,
  DEFAULT_POLKADOT_NODES,
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
    kusama:
      DEFAULT_KUSAMA_NODES.find((item) => item.url === localNodeUrl?.kusama)
        ?.url || DEFAULT_KUSAMA_NODE_URL,
    polkadot:
      DEFAULT_POLKADOT_NODES.find((item) => item.url === localNodeUrl?.polkadot)
        ?.url || DEFAULT_POLKADOT_NODE_URL,
    edgeware:
      DEFAULT_EDGEWARE_NODES.find((item) => item.url === localNodeUrl?.kusama)
        ?.url || DEFAULT_EDGEWARE_NODE_URL,
  };
})();

export const getNodeUrl = () => nodeUrl;

export const getNodes = () => ({
  kusama: DEFAULT_KUSAMA_NODES,
  polkadot: DEFAULT_POLKADOT_NODES,
  edgeware: DEFAULT_EDGEWARE_NODES,
});

export const getApi = async (chain, queryUrl) => {
  const url = queryUrl || nodeUrl?.[chain];
  if (!apiInstanceMap.has(url)) {
    apiInstanceMap.set(
      url,
      ApiPromise.create({ provider: new WsProvider(url), typesBundle: spec.typesBundle })
    );
  }
  return apiInstanceMap.get(url);
};

export const getIndentity = async (chain, address) => {
  const api = await getApi(chain);
  const { identity } = await api.derive.accounts.info(address);
  return identity;
};

export const getTipCountdown = async (chain) => {
  const api = await getApi(chain);
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

export const getBlockTime = async (chain, number) => {
  const api = await getApi(chain);
  const hash = await api.rpc.chain.getBlockHash(number);
  const block = await api.rpc.chain.getBlock(hash);
  const time = extractBlockTime(block.block.extrinsics);
  return time;
};

export const estimateBlocksTime = async (chain, blocks) => {
  return;
  // const api = await getApi(chain);
  // const nsPerBlock = api.consts.babe.expectedBlockTime.toNumber();
  // return nsPerBlock * blocks;
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
