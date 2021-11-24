const { handleBusinessWhenMotionVoted } = require("./hooks/voted");
const { updateMotionByHash } = require("../../../mongo/service/motion");
const {
  getMotionVoting,
} = require("../../common/motion/votingStorage");
const {
  TimelineItemTypes,
  CouncilEvents,
} = require("../../common/constants");

async function handleVoted(event, indexer) {
  const eventData = event.data.toJSON();
  const [voter, hash, approve,] = eventData;

  const voting = await getMotionVoting(indexer, hash);
  const updates = { voting };
  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CouncilEvents.Voted,
    args: {
      voter,
      hash,
      approve,
    },
    indexer,
  };

  await updateMotionByHash(hash, updates, timelineItem);
  await handleBusinessWhenMotionVoted(hash, voting, indexer);
}

module.exports = {
  handleVoted,
};
