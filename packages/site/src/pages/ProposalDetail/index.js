import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styled from "styled-components";
import {
  fetchProposalDetail,
  loadingProposalDetailSelector,
  proposalDetailSelector,
  setProposalDetail,
} from "../../store/reducers/proposalSlice";
import { scanHeightSelector } from "../../store/reducers/chainSlice";
import { fetchDescription } from "../../store/reducers/descriptionSlice";

import InformationTable from "./InformationTable";
import Timeline from "../Timeline";
import RelatedLinks from "../RelatedLinks";
import ProposalLifeCycleTable from "./ProposalLifeCycleTable";
import User from "../../components/User";
import Balance from "../../components/Balance";
import Voter from "../../components/Voter";
import Proposer from "../../components/Proposer";
import BlocksTime from "../../components/BlocksTime";
import TimelineCommentWrapper from "../../components/TimelineCommentWrapper";
import DetailTableWrapper from "../../components/DetailTableWrapper";

const ValueWrapper = styled.span`
  margin-right: 4px;
  color: #1d253c;
`;

const UnitWrapper = styled.span`
  color: #1d253c;
`;

function isMotion(timelineItem) {
  return !!timelineItem.timeline;
}

function timelineItemHeight(timelineItem) {
  if (isMotion(timelineItem)) {
    return timelineItem.timeline[0].indexer.blockHeight;
  }

  if ("extrinsic" === timelineItem.type) {
    return timelineItem.indexer.blockHeight;
  }

  if ("event" === timelineItem.type) {
    return timelineItem.indexer.blockHeight;
  }

  return timelineItem.indexer?.blockHeight;
}

function normalizeReferendumTimelineItem(referendum, scanHeight) {
  return {
    index: referendum.index,
    defaultUnfold: !referendum.info?.Finished,
    subTimeline:  (referendum.timeline || []).map((item) => ({
      name: item.method === "Started" ? `Referendum #${referendum.index}` : item.method,
      extrinsicIndexer: item.type === "extrinsic" ? item.indexer : undefined,
      eventIndexer: item.type === "event" ? item.indexer : undefined,
      fields: (() => {
        if (item.method === "Started") {
          const { voteThreshold } = item.args;
          return [
            { title: "Vote threshold", value: voteThreshold },
          ];
        } else if (item.method === "Passed") {
          return [];
        } else if (item.method === "NotPassed") {
          return [];
        } else if (item.method === "Executed") {
          return [];
        }
      })(),
    })),
  };
}

function normalizeMotionTimelineItem(motion, scanHeight) {
  return {
    index: motion.index,
    defaultUnfold: !motion.isFinal && motion.voting?.end >= scanHeight,
    // FIXME: && motion.treasuryProposalId !== 15
    expired:
      !motion.isFinal &&
      motion.voting?.end < scanHeight &&
      motion.treasuryProposalIndex !== 15,
    end: motion.voting?.end,
    subTimeline: (motion.timeline || []).map((item) => ({
      name: item.method === "Proposed" ? `Motion #${motion.index}` : item.method,
      extrinsicIndexer: item.type === "extrinsic" ? item.indexer : undefined,
      eventIndexer: item.type === "event" ? item.indexer : undefined,
      fields: (() => {
        if (item.method === "Proposed") {
          const { proposer, threshold } = item.args;
          let ayes, nays;
          if (motion.voting) {
            ayes = motion.voting?.ayes?.length;
            nays = motion.voting?.nays?.length || 0;
          } else {
            const votes = motion.timeline.filter(
              (item) => item.method === "Voted"
            );
            const map = votes.reduce(
              (result, { args: { voter, approve } }) => {
                result[voter] = approve;
                return result;
              },
              {}
            );
            const values = Object.values(map);
            ayes = values.filter((v) => v).length;
            nays = values.length - ayes;
          }

          const argItems = [];
          if (
            scanHeight > 0 &&
            !motion.isFinal &&
            motion.voting?.end > scanHeight
          ) {
            const blocks = motion.voting?.end - scanHeight;
            argItems.push({
              title: "Voting end",
              value: (
                <BlocksTime
                  blocks={blocks}
                  ValueWrapper={ValueWrapper}
                  UnitWrapper={UnitWrapper}
                />
              ),
            });
          }

          return [
            {
              value: (
                <Proposer
                  address={proposer}
                  agree={motion.isFinal && motion.timeline.some(item => item.method === "Approved")}
                  args={argItems}
                  value={motion.proposal.method}
                  threshold={threshold}
                  ayes={ayes}
                  nays={nays}
                />
              ),
            },
          ];
        } else if (item.method === "Voted") {
          const { voter, approve: agree } = item.args;
          return [
            {
              value: (
                <Voter
                  address={voter}
                  agree={agree}
                  value={agree ? "Aye" : "Nay"}
                />
              ),
            },
          ];
        } else if (item.method === "Closed") {
          return [];
        } else {
          return [];
        }
      })(),
    })),
  };
}

function constructProposalProcessItem(item, proposalDetail) {
  const { proposer, value, beneficiary, symbolPrice } = proposalDetail;
  let fields = [];

  const method = (item.name || item.method);

  if (method === "Proposed") {
    fields = [
      {
        title: "Proposer",
        value: <User address={proposer} />,
      },
      {
        title: "Value",
        value: <Balance value={value} usdt={symbolPrice} horizontal />,
      },
      {
        title: "Beneficiary",
        value: <User address={beneficiary} />,
      },
    ];

    return {
      name: method,
      extrinsicIndexer: item.type === "extrinsic" ? item.indexer : undefined,
      eventIndexer: item.type === "event" ? item.indexer : undefined,
      fields,
    };
  }

  if (method === "Rejected") {
    const { value } = item.args;
    return {
      name: method,
      extrinsicIndexer: item.type === "extrinsic" ? item.indexer : undefined,
      eventIndexer: item.type === "event" ? item.indexer : undefined,
      fields: [
        {
          title: "Slashed",
          value: <Balance value={value} />,
        },
      ],
    };
  }

  if (method === "Awarded") {
    return {
      name: method,
      extrinsicIndexer: item.type === "extrinsic" ? item.indexer : undefined,
      eventIndexer: item.type === "event" ? item.indexer : undefined,
      fields: [
        {
          title: "Beneficiary",
          value: <User address={beneficiary} />,
        },
        {
          title: "Value",
          value: <Balance value={value} />,
        },
      ],
    };
  }
}

function processTimeline(proposalDetail, scanHeight) {
  const { timeline, motions, referendums } = proposalDetail;
  if (!timeline) {
    return [];
  }

  const allItems = [
    ...timeline,
    ...motions.map(m => ({...m, isMotion: true})),
    ...referendums.map(r => ({...r, isReferendum: true}))
  ];
  allItems.sort((a, b) => timelineItemHeight(a) - timelineItemHeight(b));

  return allItems.map((item) => {
    if (item.isMotion) {
      return normalizeMotionTimelineItem(item, scanHeight);
    }
    else if (item.isReferendum) {
      return normalizeReferendumTimelineItem(item, scanHeight);
    }

    return constructProposalProcessItem(item, proposalDetail);
  });
}

const ProposalDetail = () => {
  const { proposalIndex } = useParams();
  const dispatch = useDispatch();
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    dispatch(fetchProposalDetail(proposalIndex));
    return () => {
      dispatch(setProposalDetail({}));
    };
  }, [dispatch, proposalIndex]);

  useEffect(() => {
    dispatch(fetchDescription("proposal", proposalIndex));
    return () => {
      dispatch(fetchDescription());
    };
  }, [dispatch, proposalIndex]);

  const loadingProposalDetail = useSelector(loadingProposalDetailSelector);
  const proposalDetail = useSelector(proposalDetailSelector);
  const scanHeight = useSelector(scanHeightSelector);

  useEffect(() => {
    setTimelineData(processTimeline(proposalDetail, scanHeight));
  }, [proposalDetail, scanHeight]);

  return (
    <>
      <DetailTableWrapper title="Proposal" desc={`#${proposalIndex}`}>
        <InformationTable
          loading={loadingProposalDetail}
          proposalIndex={proposalIndex}
        />
        <ProposalLifeCycleTable loading={loadingProposalDetail} />
        <RelatedLinks type="proposal" index={parseInt(proposalIndex)} />
      </DetailTableWrapper>
      <TimelineCommentWrapper>
        <Timeline data={timelineData} loading={loadingProposalDetail} />
      </TimelineCommentWrapper>
    </>
  );
};

export default ProposalDetail;
