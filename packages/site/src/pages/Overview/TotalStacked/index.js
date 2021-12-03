import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import dayjs from "dayjs";

import Text from "../../../components/Text";
import Card from "../../../components/Card";
import List from "../CustomList";
import Chart from "./Chart";
import { getPrecision, toPrecision } from "../../../utils";

import {
  fetchStatsHistory,
  statsHistorySelector,
} from "../../../store/reducers/overviewSlice";
import {
  chainSymbolSelector,
} from "../../../store/reducers/chainSlice";

const CardWrapper = styled(Card)`
  padding: 20px 24px;
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const Title = styled(Text)`
  font-size: 18px;
  line-height: 32px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  @media screen and (min-width: 1140px) {
    & > :first-child {
      margin-right: 24px;
    }
  }
  @media screen and (max-width: 1140px) {
    flex-direction: column;
    & > :first-child {
      margin-bottom: 24px;
    }
  }
`;

const ChartWrapper = styled.div`
  height: 252px;
  min-width: 252px;
  flex-grow: 1;
  margin-bottom: 24px;
  max-width: calc(50% - 24px);
  @media screen and (max-width: 1140px) {
    max-width: none;
  }
`;

const ListWrapper = styled.div`
  display: flex;
  @media screen and (min-width: 650px) {
    & > :first-child {
      margin-right: 24px;
    }
  }
  @media screen and (max-width: 650px) {
    flex-direction: column;
    & > :first-child {
      margin-bottom: 24px;
    }
  }
`;

const SecondListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (max-width: 650px) {
    & > :first-child {
      margin-bottom: 24px;
    }
  }
`;

const TotalStacked = () => {
  const dispatch = useDispatch();
  const [dateLabels, setDateLabels] = useState([]);
  const [incomeHistory, setIncomeHistory] = useState([]);
  const [outputHistory, setOutputHistory] = useState([]);
  const [treasuryHistory, setTreasuryHistory] = useState([]);
  const [showIndex, setShowIndex] = useState();
  const [incomeData, setIncomeData] = useState({
    title: "Income",
    icon: "square",
    labels: [
      {
        name: "Minting",
        value: 0,
        color: "#FF3B80",
      },
      {
        name: "Staking Remainder",
        value: 0,
        color: "#FF3B80",
      },
      {
        name: "Slashes",
        color: "#FF3B80",
        children: [
          {
            name: "Staking",
            value: 0,
            color: "transparent",
          },
          {
            name: "Democracy",
            value: 0,
            color: "transparent",
          },
          {
            name: "Identity",
            value: 0,
            color: "transparent",
          },
        ],
      },
      {
        name: "Others",
        value: 0,
        color: "#FF3B80",
      },
    ],
  });
  const [outputData, setOutputData] = useState({
    title: "Output",
    icon: "square",
    labels: [
      {
        name: "Proposal",
        value: 0,
        color: "#2DE1C5",
      },
      {
        name: "Tips",
        value: 0,
        color: "#2DE1C5",
      },
      {
        name: "Bounties",
        value: 0,
        color: "#2DE1C5",
      },
      {
        name: "Burnt",
        value: 0,
        color: "#2DE1C5",
      },
    ],
  });
  const [treasuryData, setTreasuryData] = useState({
    title: "Treasury",
    icon: "bar",
    labels: [
      {
        name: "Balance",
        value: 0,
        color: "#11CAF0",
      },
    ],
  });

  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);

  useEffect(() => {
    dispatch(fetchStatsHistory());
  }, [dispatch]);

  const statsHistory = useSelector(statsHistorySelector);

  useEffect(() => {
    const dateLabels = statsHistory.map(
      (statsItem) => statsItem.indexer.blockTime
    );
    setDateLabels(dateLabels);

    const incomeHistory = statsHistory.map(
      (statsItem) =>
        toPrecision(statsItem.income.minting, precision, false) +
        toPrecision(statsItem.income.stakingRemainder, precision, false) +
        toPrecision(statsItem.income.slash, precision, false) +
        toPrecision(statsItem.income.others, precision, false)
    );
    setIncomeHistory(incomeHistory);

    const outputHistory = statsHistory.map(
      (statsItem) =>
        toPrecision(statsItem.output.tip, precision, false) +
        toPrecision(statsItem.output.proposal, precision, false) +
        toPrecision(statsItem.output.bounty, precision, false) +
        toPrecision(statsItem.output.burnt, precision, false)
    );
    setOutputHistory(outputHistory);

    const treasuryHistory = statsHistory.map((statsItem) =>
      toPrecision(statsItem.treasuryBalance, precision, false)
    );
    setTreasuryHistory(treasuryHistory);
  }, [statsHistory, precision]);

  useEffect(() => {
    if (statsHistory && statsHistory.length > 0) {
      const index = showIndex ?? statsHistory.length - 1;
      const statsData = statsHistory[index];
      setIncomeData({
        title: "Income",
        date: dayjs(dateLabels?.[index]).format("YYYY-MM-DD hh:mm"),
        icon: "square",
        labels: [
          {
            name: "Minting",
            value: toPrecision(statsData.income.minting, precision, false),
            color: "#FF3B80",
          },
          {
            name: "Staking Remainder",
            value: toPrecision(
              statsData.income.stakingRemainder,
              precision,
              false
            ),
            color: "#FF3B80",
          },
          {
            name: "Slashes",
            color: "#FF3B80",
            children: [
              {
                name: "Staking",
                value: toPrecision(
                  statsData.income.slashSeats.staking,
                  precision,
                  false
                ),
                color: "transparent",
              },
              {
                name: "Democracy",
                value: toPrecision(
                  statsData.income.slashSeats.democracy,
                  precision,
                  false
                ),
                color: "transparent",
              },
              {
                name: "Identity",
                value: toPrecision(
                  statsData.income.slashSeats.identity,
                  precision,
                  false
                ),
                color: "transparent",
              },
            ],
          },
          {
            name: "Others",
            value: toPrecision(statsData.income.others, precision, false),
            color: "#FF3B80",
          },
        ],
      });

      setOutputData({
        title: "Output",
        date: dayjs(dateLabels?.[index]).format("YYYY-MM-DD hh:mm"),
        icon: "square",
        labels: [
          {
            name: "Proposal",
            value: toPrecision(statsData.output.proposal, precision, false),
            color: "#2DE1C5",
          },
          {
            name: "Tips",
            value: toPrecision(statsData.output.tip, precision, false),
            color: "#2DE1C5",
          },
          {
            name: "Bounties",
            value: toPrecision(statsData.output.bounty, precision, false),
            color: "#2DE1C5",
          },
          {
            name: "Burnt",
            value: toPrecision(statsData.output.burnt, precision, false),
            color: "#2DE1C5",
          },
        ],
      });

      setTreasuryData({
        title: "Treasury",
        date: dayjs(dateLabels?.[index]).format("YYYY-MM-DD hh:mm"),
        icon: "bar",
        labels: [
          {
            name: "Balance",
            value: toPrecision(statsData.treasuryBalance, precision, false),
            color: "#11CAF0",
          },
        ],
      });
    }
  }, [showIndex, statsHistory, dateLabels, precision]);

  const chartData = {
    dates: dateLabels,
    values: [
      {
        label: "Income",
        primaryColor: "#FFA4C5",
        secondaryColor: "#FBEAF0",
        data: incomeHistory,
        fill: true,
        icon: "square",
        order: 2,
      },
      {
        label: "Output",
        primaryColor: "#96F0E2",
        secondaryColor: "#EAFCF9",
        data: outputHistory,
        fill: true,
        icon: "square",
        order: 1,
      },
      {
        label: "Treasury",
        primaryColor: "#11CAF0",
        secondaryColor: "#11CAF0",
        data: treasuryHistory,
        fill: false,
        icon: "bar",
        order: 0,
      },
    ],
  };

  const onHover = (index) => {
    setShowIndex(index);
  };

  return (
    <CardWrapper>
      <Title>Total Stacked</Title>
      <ContentWrapper>
        <ListWrapper>
          <List data={incomeData} fixed={true}></List>
          <SecondListWrapper>
            <List data={outputData} fixed={true}></List>
            <List data={treasuryData} fixed={true}></List>
          </SecondListWrapper>
        </ListWrapper>
        <ChartWrapper>
          <Chart data={chartData} onHover={onHover} />
        </ChartWrapper>
      </ContentWrapper>
    </CardWrapper>
  );
};

export default TotalStacked;
