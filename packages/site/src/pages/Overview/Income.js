import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GrayImage from "../../components/GrayImage";
import { NavLink } from "react-router-dom";

import DoughnutCard from "./DoughnutCard";
import TextMinor from "../../components/TextMinor";
import {
  OVERVIEW_STAKING_COLOR,
  OVERVIEW_DEMOCRACY_COLOR,
  OVERVIEW_IDENTITY_COLOR,
  OVERVIEW_OTHERS_COLOR,
  OVERVIEW_MINTING_COLOR,
  OVERVIEW_STAKING_REMAINDER_COLOR,
  TEXT_DARK_MAJOR,
} from "../../constants";

const LinkButton = styled(TextMinor)`
  display: flex;
  position: absolute;
  right: 24px;
  top: 20px;
  :hover {
    color: ${TEXT_DARK_MAJOR};
    & > :last-child {
      -webkit-filter: grayscale(0);
      filter: grayscale(0);
      opacity: 1;
    }
  }
`;

const Income = ({
  minting,
  stakingRemainder,
  slashStaking,
  slashDemocracy,
  slashIdentity,
  others,
}) => {
  const [incomeData, setIncomeData] = useState({
    icon: "circle",
    labels: [],
  });
  const [incomeStatus, setIncomeStatus] = useState({
    labels: [
      {
        name: "Minting",
      },
      {
        name: "Staking Reminder",
      },
      {
        name: "Slashes",
        children: [
          {
            name: "Staking",
          },
          {
            name: "Democracy",
          },
          {
            name: "Identity",
          },
        ],
      },
      {
        name: "Others",
      },
    ],
  });

  useEffect(() => {
    setIncomeData({
      icon: "circle",
      labels: [
        {
          name: "Minting",
          value: minting,
          color: OVERVIEW_MINTING_COLOR,
        },
        {
          name: "Staking Reminder",
          value: stakingRemainder,
          color: OVERVIEW_STAKING_REMAINDER_COLOR,
        },
        {
          name: "Slashes",
          children: [
            {
              name: "Staking",
              value: slashStaking,
              color: OVERVIEW_STAKING_COLOR,
            },
            {
              name: "Democracy",
              value: slashDemocracy,
              color: OVERVIEW_DEMOCRACY_COLOR,
            },
            {
              name: "Identity",
              value: slashIdentity,
              color: OVERVIEW_IDENTITY_COLOR,
            },
          ],
        },
        {
          name: "Others",
          value: others,
          color: OVERVIEW_OTHERS_COLOR,
        },
      ],
    });
  }, [
    minting,
    stakingRemainder,
    slashStaking,
    slashDemocracy,
    slashIdentity,
    others,
  ]);

  const clickEvent = (name) => {
    const obj = Object.assign({}, incomeStatus);
    obj.labels.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (child.name === name) {
            child.disabled = !child.disabled;
          }
        });
        if (item.children.every((item) => item.disabled)) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      }
      if (item.name === name) {
        const disabled = !item.disabled;
        item.disabled = disabled;
        if (item.children) {
          item.children.forEach((child) => {
            child.disabled = disabled;
          });
        }
      }
    });
    setIncomeStatus(obj);
  };

  return (
    <DoughnutCard
      title="Income"
      data={incomeData}
      status={incomeStatus}
      clickEvent={clickEvent}
    >
      <NavLink to={`/income`}>
        <LinkButton>
          Detail
          <GrayImage src="/imgs/caret-right.svg" width={24} />
        </LinkButton>
      </NavLink>
    </DoughnutCard>
  );
};

export default Income;
