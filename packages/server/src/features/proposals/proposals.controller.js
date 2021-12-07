const {
  getProposalCollection,
  getMotionCollection,
  getDemocracyReferendumCollection
} = require("../../mongo");
const { extractPage } = require("../../utils");
const linkService = require("../../services/link.service");
const descriptionService = require("../../services/description.service");

class ProposalsController {
  async getProposals(ctx) {
    const { page, pageSize } = extractPage(ctx);
    const { status } = ctx.request.query;
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const condition = {};
    if (status) {
      condition["state.state"] = status;
    }
    const proposalCol = await getProposalCollection();

    const total = proposalCol.countDocuments(condition);
    const list = proposalCol
      .find(condition, { timeline: 0 })
      .sort({
        "indexer.blockHeight": -1,
      })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();
    const result = await Promise.all([total, list]);

    ctx.body = {
      items: result[1].map((item) => ({
        indexer: item.indexer,
        proposalIndex: item.proposalIndex,
        proposeTime: item.indexer.blockTime,
        proposeAtBlockHeight: item.indexer.blockHeight,
        proposer: item.proposer,
        value: item.value,
        symbolPrice: item.symbolPrice,
        beneficiary: item.beneficiary,
        links: item.links || [],
        curator: item.curator,
        description: item.description,
        latestState: {
          state: item.state?.state || item.state?.name,
          time: (
            item.state?.eventIndexer ||
            item.state?.extrinsicIndexer ||
            item.state?.indexer
          ).blockTime,
          motionVoting: item.state?.data?.motionVoting,
        },
      })),
      page,
      pageSize,
      total: result[0],
    };
  }

  async getProposalDetail(ctx) {
    const proposalIndex = parseInt(ctx.params.proposalIndex);

    const proposalCol = await getProposalCollection();
    const proposal = await proposalCol.findOne({ proposalIndex });
    if (!proposal) {
      ctx.status = 404;
      return;
    }

    const motionHashes = (proposal.motions || []).map(motionInfo => motionInfo.hash);

    const motionCol = await getMotionCollection();
    const proposalMotions = await motionCol
      .find({
        hash: { $in: motionHashes }
      })
      .sort({ index: 1 })
      .toArray();

    const motions = (proposal.motions || []).map(motionInfo => {
      const targetMotion = (proposalMotions || []).find(
        m => m.hash === motionInfo.hash && m.indexer.blockHeight === motionInfo.indexer.blockHeight
      )

      return {
        motionInfo,
        ...targetMotion,
      }
    });

    const referndumCol = await getDemocracyReferendumCollection();
    const referendums = await referndumCol.find({
      index: {
        $in: (proposal.referendums || []).map(info => info.referendumIndex),
      }
    }).sort({ index: 1 }).toArray();

    ctx.body = {
      indexer: proposal.indexer,
      proposalIndex: proposal.proposalIndex,
      proposeTime: proposal.indexer.blockTime,
      proposeAtBlockHeight: proposal.indexer.blockHeight,
      proposer: proposal.proposer,
      value: proposal.value,
      symbolPrice: proposal.symbolPrice,
      beneficiary: proposal.beneficiary,
      latestState: proposal.state,
      motions,
      timeline: proposal.timeline,
      referendums,
    };
  }

  async getProposalSummary(ctx) {
    const proposalCol = await getProposalCollection();
    const total = await proposalCol.estimatedDocumentCount();
    const countByStates = await proposalCol
      .aggregate([
        {
          $group: {
            _id: "$state.state",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const result = { total };
    countByStates.forEach((item) => (result[item._id] = item.count));

    ctx.body = result;
  }

  async getProposalLinks(ctx) {
    const proposalIndex = parseInt(ctx.params.proposalIndex);

    ctx.body = await linkService.getLinks({
      indexer: {
        type: "proposal",
        index: proposalIndex,
      },
    });
  }

  async createProposalLink(ctx) {
    const proposalIndex = parseInt(ctx.params.proposalIndex);
    const { link, description } = ctx.request.body;

    ctx.body = await linkService.createLink(
      {
        indexer: {
          type: "proposal",
          index: proposalIndex,
        },
        link,
        description,
      },
      ctx.request.headers.signature
    );
  }

  async deleteProposalLink(ctx) {
    const proposalIndex = parseInt(ctx.params.proposalIndex);
    const linkIndex = parseInt(ctx.params.linkIndex);

    ctx.body = await linkService.deleteLink(
      {
        indexer: {
          type: "proposal",
          index: proposalIndex,
        },
        linkIndex,
      },
      ctx.request.headers.signature
    );
  }

  async getProposalDescription(ctx) {
    const proposalIndex = parseInt(ctx.params.proposalIndex);

    ctx.body = await descriptionService.getDescription({
      indexer: {
        type: "proposal",
        index: proposalIndex,
      },
    });
  }

  async setProposalDescription(ctx) {
    const proposalIndex = parseInt(ctx.params.proposalIndex);
    const { description, curator } = ctx.request.body;

    ctx.body = await descriptionService.setDescription(
      {
        indexer: {
          type: "proposal",
          index: proposalIndex,
        },
        description,
        curator,
      },
      ctx.request.headers.signature
    );
  }
}

module.exports = new ProposalsController();
