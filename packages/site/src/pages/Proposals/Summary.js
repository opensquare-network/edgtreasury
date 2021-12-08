import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import CountDown from "../../components/CountDown";
import BlocksTime from "../../components/BlocksTime";
import { mrgap } from "../../styles";
import Card from "../../components/Card";

import { fetchProposalsSummary, proposalSummarySelector, } from "../../store/reducers/proposalSlice";
import {
  chainSymbolSelector,
  fetchSpendPeriod,
  spendPeriodSelector,
} from "../../store/reducers/chainSlice";
import { fetchTreasury, treasurySelector, } from "../../store/reducers/burntSlice";
import { abbreviateBigNumber } from "../../utils";
import { TEXT_DARK_ACCESSORY } from "../../constants";

const Wrapper = styled(Card)`
  position: relative;
  padding: 16px 20px 8px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  & > div {
    margin-bottom: 8px;
  }
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Item = styled.div`
  min-width: 120px;
  
  &.absolute {
    position: absolute;
    right: 24px;
  }
  &.grow {}
  &.countdown {
    min-width: 0;
  }
  &.right {
    text-align: right;
  }
  &.available,
  &.next-burn {
    min-width: 160px;
  }
  &.spend-period {
    min-width: 180px;
  }

  @media screen and (max-width: 1140px) {
    &.countdown {
      display: none;
    }
    &.right {
      text-align: left;
    }
    &.available,
    &.next-burn {
      min-width: 120px;
    }
    &.spend-period {
      min-width: 120px;
    }
    & > div:last-child {
      justify-content: flex-start;
    }
  }
`;

const Title = styled(TextMinor)`
  line-height: 24px;
  color: ${TEXT_DARK_ACCESSORY} !important;
`;

const Value = styled(Text)`
  line-height: 32px;
  font-weight: bold;
  font-size: 18px;
`;

const Unit = styled(TextMinor)`
  line-height: 32px;
  font-weight: bold;
  font-size: 18px;
`;

const ValueWrapper = styled.div`
  display: flex;
  ${css`
    ${mrgap("4px")}
  `}
`;

const Summary = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProposalsSummary());
    dispatch(fetchSpendPeriod());
    dispatch(fetchTreasury());
  }, [dispatch]);

  const summary = useSelector(proposalSummarySelector);
  const spendPeriod = useSelector(spendPeriodSelector);
  const treasury = useSelector(treasurySelector);
  const symbol = useSelector(chainSymbolSelector);

  return (
    <Wrapper>
      <Item>
        <Title>Ongoing</Title>
        <Value>{summary.numOfOngoing}</Value>
      </Item>
      <Item>
        <Title>Approved</Title>
        <Value>{summary.numOfApproved}</Value>
      </Item>
      <Item>
        <Title>Awarded</Title>
        <Value>{summary.numOfAwarded}</Value>
      </Item>
      <Item className="grow">
        <Title>Total</Title>
        <Value>{summary.total}</Value>
      </Item>
      <Item className="available">
        <Title>Available</Title>
        <ValueWrapper>
          <Value>{abbreviateBigNumber(treasury.free, 2)}</Value>
          <Unit>{symbol}</Unit>
        </ValueWrapper>
      </Item>
      <Item className="next-burn">
        <Title>Next burn</Title>
        <ValueWrapper>
          <Value>
            {abbreviateBigNumber(treasury.burnPercent * treasury.free, 4)}
          </Value>
          <Unit>{symbol}</Unit>
        </ValueWrapper>
      </Item>
      <Item className="spend-period">
        <Title>Spend period</Title>
        <BlocksTime
          blocks={spendPeriod.restBlocks}
          ValueWrapper={Value}
          UnitWrapper={Unit}
          SectionWrapper={Fragment}
          TimeWrapper={ValueWrapper}
          unitMapper={{ d: "Day" }}
          pluralUnitMapper={{ d: "Days" }}
        />
      </Item>
      <Item className="absolute countdown">
        <CountDown percent={spendPeriod.progress} />
      </Item>
    </Wrapper>
  );
};

export default Summary;
