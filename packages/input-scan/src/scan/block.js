const { specialDataArr } = require("./specialHeights");
const { getNowIncomeSeats } = require("../mongo/scanHeight");
const { bigAdds, bigAdd } = require("../utils");
const { handleEvents } = require("../business/event");

async function calcSeats(details) {
  const detailSlash = bigAdds([
    details.stakingSlash,
    details.idSlash,
    details.democracySlash,
  ])

  const nowSeats = await getNowIncomeSeats();
  return {
    minting: bigAdd(nowSeats.minting, details.minting),
    stakingRemainder: bigAdd(nowSeats.stakingRemainder, details.stakingRemainder),
    transfer: bigAdd(nowSeats.transfer, details.transfer),
    others: bigAdd(nowSeats.others, details.others),
    slash: bigAdd(nowSeats.slash, detailSlash),
    slashSeats: {
      staking: bigAdd(nowSeats.slashSeats.staking, details.stakingSlash),
      democracy: bigAdd(nowSeats.slashSeats.democracy, details.democracySlash),
      identity: bigAdd(nowSeats.slashSeats.identity, details.idSlash),
    }
  }
}

async function handleSpecialBlock(height) {
  const data = specialDataArr.find(data => data.height === height)
  if (!data) {
    return
  }

  return calcSeats(data.details);
}

async function scanNormalizedBlock(block, blockEvents, blockIndexer) {
  const details = await handleEvents(blockEvents, block.extrinsics, blockIndexer);
  return calcSeats(details);
}

module.exports = {
  handleSpecialBlock,
  scanNormalizedBlock,
}
