const { isProposalMotion } = require("../../motion/utils");
const { queryImageCall } = require("./storage");

async function getTreasuryProposalInfoFromImage(proposalHash, indexer) {
  const proposalCall = await queryImageCall(proposalHash, indexer);

  if (!proposalCall) {
    return
  }

  const { section, method, args } = proposalCall;
  if (isProposalMotion(section, method)) {
    return {
      section,
      method,
      proposalIndex: args[0].toJSON(),
    }
  }

  return null
}

module.exports = {
  getTreasuryProposalInfoFromImage,
}
