const { handleWrappedCall } = require("../../common/call");
const { updateBounty } = require("../../../mongo/service/bounty");
const { getBountyMeta } = require("../../common/bounty/meta");
const {
  Modules,
  TimelineItemTypes,
  BountyMethods,
} = require("../../common/constants");
const { hexToString } = require("@polkadot/util");

async function handleBountyExtended(event, indexer, events, extrinsic) {
  const eventData = event.data.toJSON();
  const bountyIndex = eventData[0];

  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);

  let caller = extrinsic.signer;
  let remark = '';
  await handleWrappedCall(
    extrinsic.method,
    extrinsic.signer.toString(),
    indexer,
    events,
    async (call, signer,) => {
      const { section, method, args } = call
      if ([Modules.Bounties, Modules.Treasury].includes(section) && BountyMethods.extendBountyExpiry === method) {
        if (bountyIndex === args[0].toJSON()) {
          caller = signer;
          remark = hexToString(args[1].toHex());
        }
      }
    })

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    name: event.method,
    args: {
      caller,
      remark,
    },
    eventData,
    indexer,
  };

  await updateBounty(bountyIndex, { meta, }, timelineItem);
}

module.exports = {
  handleBountyExtended,
}
