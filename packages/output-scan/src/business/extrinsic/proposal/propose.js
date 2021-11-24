const BigNumber = require("bignumber.js");
const { insertProposal } = require("../../../mongo/service/proposal");
const { getTreasuryProposalMeta } = require("../../common/proposal/meta");
const {
  Modules,
  TreasuryProposalMethods,
  TreasuryProposalEvents,
  TimelineItemTypes,
} = require("../../common/constants");
const { logger } = require("../../../logger")

async function handleTreasuryProposeCall(call, author, indexer, events) {
  if (
    ![Modules.Treasury].includes(call.section) ||
    TreasuryProposalMethods.proposeSpend !== call.method
  ) {
    return;
  }

  const proposedEvent = events.find(({ event: { section, method } } = {}) => {
    return Modules.Treasury === section && TreasuryProposalEvents.Proposed === method
  })

  if (!proposedEvent) {
    throw `treasury propose extrinsic no Proposed event at ${ indexer.blockHeight }`
  }

  const [proposalIndex] = proposedEvent.event.data.toJSON()
  let meta = await getTreasuryProposalMeta(indexer.blockHash, proposalIndex);
  if (!meta) {
    meta = {
      proposer: author.toString(),
      value: new BigNumber(call.args[0].toHex()).toString(),
      beneficiary: call.args[1].toString(),
    }
    // todo: calc the bond value
  }

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: TreasuryProposalEvents.Proposed,
    args: {
      index: proposalIndex,
    },
    indexer,
  };

  const state = {
    indexer,
    state: TreasuryProposalEvents.Proposed,
  };

  const { proposer, value, beneficiary } = meta;
  const obj = {
    indexer,
    proposalIndex,
    proposer,
    value: new BigNumber(value).toString(),
    beneficiary,
    meta,
    state,
    timeline: [timelineItem],
    motions: [],
    externalMotions: [],
    referendums: [],
  };

  await insertProposal(obj);
  logger.info(`Treasury proposal ${ proposalIndex } saved`);
}

module.exports = {
  handleTreasuryProposeCall,
}
