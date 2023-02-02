const { handleOthers } = require("./others");
const { handleCancelProposalSlash } = require("./democracy/cancelProposal");
const { handleIdentityKilledSlash } = require("./identity/killedSlash");
const { handleStakingSlashEvent } = require("./staking/slash");
const { handleEraPayout } = require("./staking/eraPayout");
const { handleMinting } = require("./minting");
const { Modules, TreasuryCommonEvent } = require("../common/constants");
const { bigAdd, bigAdds } = require("../../utils");
const { handleTransfer } = require("./transfer");

async function handleDeposit(
  event,
  indexer,
  blockEvents,
) {
  const stakingRemainder = await handleEraPayout(event, indexer, blockEvents);
  const stakingSlash = await handleStakingSlashEvent(...arguments);
  const idSlash = await handleIdentityKilledSlash(...arguments);
  const democracySlash = await handleCancelProposalSlash(event, indexer, blockEvents);

  const items = {
    stakingRemainder,
    stakingSlash,
    idSlash,
    democracySlash,
  }

  const sum = bigAdds(Object.values(items));

  let others = 0;
  if (parseInt(sum) <= 0) {
    others = await handleOthers(event, indexer);
  }

  return {
    ...items,
    others,
  }
}

async function handleCommon(
  indexer,
  event,
) {
  const transfer = await handleTransfer(event, indexer);
  const minting = await handleMinting(event, indexer);

  return {
    transfer,
    minting,
  }
}

async function handleEvents(events, extrinsics, blockIndexer) {
  let transfer = 0;
  let minting = 0;

  let stakingRemainder = 0;
  let stakingSlash = 0;
  let idSlash = 0;
  let democracySlash = 0;

  let others = 0;

  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    const indexer = {
      ...blockIndexer,
      extrinsicIndex: phase.isNone ? undefined : phase.value.toNumber(),
      eventIndex: sort,
    };

    const commonObj = await handleCommon(indexer, event, events);
    transfer = bigAdd(transfer, commonObj.transfer);
    minting = bigAdd(minting, commonObj.minting);

    const { section, method } = event;
    if (Modules.Treasury !== section || TreasuryCommonEvent.Deposit !== method) {
      continue;
    }

    const depositObj = await handleDeposit(event, indexer, events);
    stakingRemainder = bigAdd(stakingRemainder, depositObj.stakingRemainder);
    stakingSlash = bigAdd(stakingSlash, depositObj.stakingSlash);
    idSlash = bigAdd(idSlash, depositObj.idSlash);
    democracySlash = bigAdd(democracySlash, depositObj.democracySlash);
    others = bigAdd(others, depositObj.others);
  }

  return {
    transfer,
    minting,
    stakingRemainder,
    stakingSlash,
    idSlash,
    democracySlash,
    others,
  }
}

module.exports = {
  handleEvents,
}
