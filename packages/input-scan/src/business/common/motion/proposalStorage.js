const { getApi } = require("../../../chain/api");
const { normalizeCall } = require("./utils");
const {
  findRegistry,
} = require("../../../chain/specs");
const { GenericCall } = require("@polkadot/types");

async function getMotionProposal(blockHash, motionHash) {
  const api = await getApi()
  return await api.query.council.proposalOf(motionHash);
}

async function getMotionProposalCall(motionHash, indexer) {
  const raw = await getMotionProposal(indexer.blockHash, motionHash);
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
