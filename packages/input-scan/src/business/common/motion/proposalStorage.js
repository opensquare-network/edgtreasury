const { findDecorated } = require("@edgtreasury/output-scan/src/chain/specs");
const { getApi } = require("../../../chain/api");
const { normalizeCall } = require("./utils");
const {
  findRegistry,
} = require("../../../chain/specs");
const { GenericCall } = require("@polkadot/types");

async function getMotionProposal(indexer, motionHash) {
  const api = await getApi();
  const decorated = await findDecorated(indexer.blockHeight);
  const key = [decorated.query.council.proposalOf, motionHash];

  return await api.rpc.state.getStorage(key, indexer.blockHash);
}

async function getMotionProposalCall(motionHash, indexer) {
  const raw = await getMotionProposal(indexer, motionHash);
  const registry = await findRegistry(indexer);
  return normalizeCall(new GenericCall(registry, raw.toHex()));
}

async function getMotionProposalByHeight(motionHash, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);

  return await getMotionProposalCall(motionHash, {
    blockHeight,
    blockHash
  })
}

module.exports = {
  getMotionProposal,
  getMotionProposalCall,
  getMotionProposalByHeight,
};
