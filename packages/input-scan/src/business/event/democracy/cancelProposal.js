const { getDemocracySlashCollection } = require("../../../mongo/index");
const { getMotionProposalByHeight } = require("../../common/motion/proposalStorage");
const {
  Modules,
  CouncilEvents,
  DemocracyMethods,
} = require("../../common/constants")

function isCancelProposal(section, method) {
  return Modules.Democracy === section && DemocracyMethods.cancelProposal === method;
}

async function handleCancelProposalSlash(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort <= 0) {
    return 0;
  }

  const preEvent = blockEvents[sort - 1];
  const { event: { section, method, data, }, } = preEvent;

  if (Modules.Council !== section || method !== CouncilEvents.Executed) {
    return 0
  }

  if (!data[1].isOk) {
    return 0
  }

  const proposalHash = preEvent.event.data[0].toString()
  const call = await getMotionProposalByHeight(proposalHash, indexer.blockHeight - 1);
  if (!isCancelProposal(call.section, call.method)) {
    return 0
  }
  const proposalIndex = call.args[0].value;

  const obj = {
    indexer,
    section: Modules.Democracy,
    method: call.method,
    balance: event.data[0].toString(),
    canceledProposalIndex: proposalIndex,
  }

  const col = await getDemocracySlashCollection()
  await col.insertOne(obj)
  return obj.balance;
}

module.exports = {
  handleCancelProposalSlash,
}
