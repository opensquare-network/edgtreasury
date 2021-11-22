const { bigAdd } = require("../utils");
const { stringUpperFirst } = require("@polkadot/util");

const bountyStatuses = [
  "Proposed",
  "Approved",
  "Funded",
  "CuratorProposed",
  "Active",
  "PendingPayout",
];

async function calcOutput(
  proposals = [],
  tips = [],
  bounties = [],
  burntList = []
) {
  const spentProposals = proposals.filter(
    ({ state: { name, state } }) => (name || state) === "Awarded"
  );
  const proposalSpent = spentProposals.reduce(
    (result, { value }) => bigAdd(result, value),
    0
  );

  const tipSpent = tips.reduce((result, { state: { state }, medianValue }) => {
    if (state !== "TipClosed") {
      return result;
    }

    if (!medianValue) {
      return result;
    }

    return bigAdd(result, medianValue);
  }, 0);

  const bountySpent = bounties.reduce((result, { meta: { status, value } }) => {
    const statusKey = stringUpperFirst(Object.keys(status)[0]);

    const index = bountyStatuses.findIndex((item) => item === statusKey);
    return index >= 2 ? bigAdd(result, value) : result;
  }, 0);

  const burntTotal = burntList.reduce((result, { balance }) => {
    return bigAdd(result, balance);
  }, 0);

  return {
    proposal: proposalSpent,
    tip: tipSpent,
    bounty: bountySpent,
    burnt: burntTotal,
  };
}

module.exports = {
  calcOutput,
}
