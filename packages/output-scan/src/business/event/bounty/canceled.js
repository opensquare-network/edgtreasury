const { handleWrappedCall } = require("../../common/call");
const { updateBounty } = require("../../../mongo/service/bounty");
const { getBountyMetaByHeight } = require("../../common/bounty/meta");
const {
  TimelineItemTypes,
  BountyStatus,
  Modules,
  BountyMethods,
} = require("../../common/constants");

async function handleBountyCanceled(event, indexer, events, extrinsic) {
  const eventData = event.data.toJSON();
  const [bountyIndex] = eventData;

  const meta = await getBountyMetaByHeight(bountyIndex, indexer.blockHeight - 1);

  let caller = extrinsic.signer;
  await handleWrappedCall(
    extrinsic.method,
    extrinsic.signer.toString(),
    indexer,
    events,
    async (call, signer,) => {
      const { section, method, args } = call
      if ([Modules.Bounties, Modules.Treasury].includes(section) && BountyMethods.closeBounty === method) {
        if (bountyIndex === args[0].toJSON()) {
          caller = signer
        }
      }
    })

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: event.method,
    args: {
      caller,
    },
    eventData,
    indexer,
  };

  const state = {
    indexer,
    state: BountyStatus.Canceled,
  }

  await updateBounty(bountyIndex, { meta, state }, timelineItem);
}

module.exports = {
  handleBountyCanceled,
}
