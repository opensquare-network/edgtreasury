const { findDecorated } = require("../../../chain/specs");
const { normalizeCall } = require("../call/normalize");
const { getApi } = require("../../../chain/api");
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

async function getMotionCall(motionHash, indexer) {
  const raw = await getMotionProposal(indexer, motionHash);
  const registry = await findRegistry(indexer.blockHeight);
  return new GenericCall(registry, raw.toHex());
}

async function getMotionProposalCall(motionHash, indexer) {
  const raw = await getMotionProposal(indexer, motionHash);
  const registry = await findRegistry(indexer.blockHeight);
  return normalizeCall(new GenericCall(registry, raw.toHex()));
}

module.exports = {
  getMotionProposal,
  getMotionCall,
  getMotionProposalCall,
};
