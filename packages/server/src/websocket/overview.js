const {
  getProposalCollection,
  getBountyCollection,
  getTipCollection,
  getBurntCollection,
  getStatusCollection,
  getOutputTransferCollection,
} = require("../mongo");
const { bigAdd } = require("../utils");
const { setOverview, getOverview } = require("./store");
const { overviewRoom, OVERVIEW_FEED_INTERVAL } = require("./constants");
const util = require("util");
const BigNumber = require("bignumber.js");
const { stringUpperFirst } = require("@polkadot/util");

async function feedOverview(io) {
  try {
    const oldStoreOverview = getOverview();
    const overview = await calcOverview();

    if (util.isDeepStrictEqual(overview, oldStoreOverview)) {
      return;
    }

    setOverview(overview);
    io.to(overviewRoom).emit("overview", overview);
  } catch (e) {
    console.error("feed overview error:", e);
  } finally {
    setTimeout(feedOverview.bind(null, io), OVERVIEW_FEED_INTERVAL);
  }
}

async function calcOverview() {
  const proposalCol = await getProposalCollection();
  const proposals = await proposalCol
    .find({}, { value: 1, beneficiary: 1, meta: 1, state: 1 })
    .toArray();

  const tipCol = await getTipCollection();
  const tips = await tipCol
    .find({}, { finder: 1, medianValue: 1, state: 1 })
    .toArray();

  const bountyCol = await getBountyCollection();
  const bounties = await bountyCol.find({}, { meta: 1, state: 1 }).toArray();

  const burntCol = await getBurntCollection();
  const burntList = await burntCol.find({}, { balance: 1 }).toArray();

  const outputTransferCol = await getOutputTransferCollection();
  const outputTransferList = await outputTransferCol
    .find({}, { balance: 1 })
    .toArray();

  const count = await calcCount(
    proposals,
    tips,
    bounties,
    burntList,
    outputTransferList
  );
  const output = await calcOutput(
    proposals,
    tips,
    bounties,
    burntList,
    outputTransferList
  );
  const bestProposalBeneficiaries = calcBestProposalBeneficiary(
    proposals
  );
  const bestTipFinders = calcBestTipProposers(tips);

  const statusCol = await getStatusCollection();
  const incomeScan = await statusCol.findOne({ name: "income-scan" });

  return {
    count,
    spent: output,
    output,
    bestProposalBeneficiaries,
    bestTipFinders,
    income: incomeScan?.seats || {
      minting: 0,
      stakingRemainder: 0,
      inflation: 0,
      slash: 0,
      transfer: 0,
      others: 0,
      slashSeats: {
        treasury: 0,
        staking: 0,
        democracy: 0,
        electionsPhragmen: 0,
        identity: 0,
      },
    },
  };
}

async function calcCount(
  proposals = [],
  tips = [],
  bounties = [],
  burntList = [],
  outputTransferList = []
) {
  const unFinishedProposals = proposals.filter(
    ({ state: { name, state } }) => (name || state) !== "Awarded" && (name || state) !== "Rejected"
  );
  const proposal = {
    unFinished: unFinishedProposals.length,
    all: proposals.length,
  };

  const unFinishedTips = tips.filter(
    ({ state: { state } }) => !["TipClosed", "TipRetracted"].includes(state)
  );
  const tip = {
    unFinished: unFinishedTips.length,
    all: tips.length,
  };

  const unFinishedBounties = bounties.filter(
    ({ state: { name: stateName } }) => {
      return ![
        "BountyRejected",
        "Rejected",
        "BountyClaimed",
        "Claimed",
        "BountyCanceled"].includes(
        stateName
      );
    }
  );

  const bounty = {
    unFinished: unFinishedBounties.length,
    all: bounties.length,
  };

  const burnt = {
    all: burntList.length,
  };

  const transfer = {
    all: outputTransferList.length,
  };

  return { proposal, tip, bounty, burnt, transfer };
}

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
  burntList = [],
  outputTransferList = []
) {
  const spentProposals = proposals.filter(
    ({ state: { name, state } }) => (name || state) === "Awarded"
  );
  const proposalSpent = spentProposals.reduce(
    (result, { value }) => bigAdd(result, value),
    0
  );

  const tipSpent = tips.reduce((result, { state, medianValue }) => {
    if (state.state !== "TipClosed") {
      return result;
    }

    const eventValue = state.data[2];
    const value = eventValue || medianValue || 0;
    return bigAdd(result, value);
  }, 0);

  const bountySpent = bounties.reduce((result, { meta: { status, value } }) => {
    const statusKey = stringUpperFirst(Object.keys(status)[0]);

    const index = bountyStatuses.findIndex((item) => item === statusKey);
    return index >= 2 ? bigAdd(result, value) : result;
  }, 0);

  const burntTotal = burntList.reduce((result, { balance }) => {
    return bigAdd(result, balance);
  }, 0);

  const transferTotal = outputTransferList.reduce((result, { balance }) => {
    return bigAdd(result, balance);
  }, 0);

  return {
    proposal: proposalSpent,
    tip: tipSpent,
    bounty: bountySpent,
    burnt: burntTotal,
    transfer: transferTotal,
  };
}

function sortByValue(arr) {
  return arr.sort((a, b) => {
    return Number(b.fiatValue) - Number(a.fiatValue);
  });
}

function sortByCount(arr) {
  return arr.sort((a, b) => {
    return Number(b.count) - Number(a.count);
  });
}

function addUsdtValue(currUsdtValue, nextSymbolValue, symbolPrice) {
  const edgDecimals = 18;
  const nextUsdtValue = new BigNumber(nextSymbolValue)
    .div(Math.pow(10, edgDecimals))
    .multipliedBy(symbolPrice);
  return currUsdtValue ? nextUsdtValue.plus(currUsdtValue) : nextUsdtValue;
}

function calcBestProposalBeneficiary(proposals = []) {
  const spentProposals = proposals.filter(
    ({ state: { name, state } }) => (name || state) === "Awarded"
  );
  const map = {};
  for (const { beneficiary, value, symbolPrice } of spentProposals) {
    const perhaps = map[beneficiary];
    const proposalValue = perhaps ? bigAdd(perhaps.value, value) : value;
    const proposalFiatValue = addUsdtValue(
      perhaps ? perhaps.fiatValue : 0,
      value,
      symbolPrice || 0,
    );
    const count = perhaps ? perhaps.count + 1 : 1;

    map[beneficiary] = {
      value: proposalValue,
      fiatValue: proposalFiatValue,
      count,
    };
  }

  const beneficiaries = Object.entries(map).map(
    ([beneficiary, { value, fiatValue, count }]) => {
      return {
        beneficiary,
        value,
        fiatValue,
        count,
      };
    }
  );

  return sortByValue(beneficiaries).slice(0, 10);
}

function calcBestTipProposers(tips = []) {
  const closedTips = tips.filter(
    ({ state: { state } }) => state === "TipClosed"
  );
  const map = {};
  for (const { finder, medianValue, symbolPrice } of closedTips) {
    const tipMedianValue = medianValue || 0;
    const perhaps = map[finder];
    const tipValue = perhaps ? bigAdd(perhaps.value, tipMedianValue) : tipMedianValue;
    const tipFiatValue = addUsdtValue(
      perhaps ? perhaps.fiatValue : 0,
      tipMedianValue,
      symbolPrice || 0,
    );
    const count = perhaps ? perhaps.count + 1 : 1;

    map[finder] = { value: tipValue, fiatValue: tipFiatValue, count };
  }

  const finders = Object.entries(map).map(
    ([finder, { value, fiatValue, count }]) => {
      return {
        finder,
        value,
        fiatValue,
        count,
      };
    }
  );

  return sortByCount(finders).slice(0, 10);
}

module.exports = {
  feedOverview,
};
