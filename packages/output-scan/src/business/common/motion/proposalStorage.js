const { normalizeCall } = require("../call/normalize");
const { getApi } = require("../../../chain/api");
const {
  findRegistry,
} = require("../../../chain/specs");
const { GenericCall } = require("@polkadot/types");

async function getMotionProposal(blockHash, motionHash) {
  const api = await getApi()
  return api.query.council.proposalOf.at(blockHash, motionHash);
}

async function getMotionCall(motionHash, indexer) {
  const raw = await getMotionProposal(indexer.blockHash, motionHash);
  const registry = await findRegistry(indexer.blockHeight);
  return new GenericCall(registry, raw.toHex());
}

async function getMotionProposalCall(motionHash, indexer) {
  const raw = await getMotionProposal(indexer.blockHash, motionHash);
  const registry = await findRegistry(indexer.blockHeight);
  return normalizeCall(new GenericCall(registry, raw.toHex()));
}

module.exports = {
  getMotionProposal,
  getMotionCall,
  getMotionProposalCall,
};
