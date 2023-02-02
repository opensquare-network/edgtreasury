const { normalizeCall } = require("../call/normalize");
const { GenericCall } = require("@polkadot/types");
const { chain: { findBlockApi, findRegistry } } = require("@osn/scan-common");

async function getMotionProposal(indexer, motionHash) {
  const blockApi = await findBlockApi(indexer.blockHash);
  return await blockApi.query.council.proposalOf(motionHash);
}

async function getMotionCall(motionHash, indexer) {
  const raw = await getMotionProposal(indexer, motionHash);
  const registry = await findRegistry(indexer);
  return new GenericCall(registry, raw.toHex());
}

async function getMotionProposalCall(motionHash, indexer) {
  const raw = await getMotionProposal(indexer, motionHash);
  const registry = await findRegistry(indexer);
  return normalizeCall(new GenericCall(registry, raw.toHex()));
}

module.exports = {
  getMotionProposal,
  getMotionCall,
  getMotionProposalCall,
};
