const {
  Modules,
  DemocracyMethods,
} = require("../constants");

function isDemocracyExternalMotion(section, method) {
  return [Modules.Democracy].includes(section) && [
    DemocracyMethods.externalProposeMajority,
    DemocracyMethods.externalPropose,
    DemocracyMethods.externalProposeDefault,
  ].includes(method)
}

module.exports = {
  isDemocracyExternalMotion,
}
