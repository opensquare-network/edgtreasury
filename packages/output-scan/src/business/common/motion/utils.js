const { Modules, TreasuryProposalMethods } = require("../constants");

function isProposalMotion(section, method) {
  return Modules.Treasury === section &&
    [
      TreasuryProposalMethods.approveProposal,
      TreasuryProposalMethods.rejectProposal,
    ].includes(method)
}

module.exports = {
  isProposalMotion,
}
