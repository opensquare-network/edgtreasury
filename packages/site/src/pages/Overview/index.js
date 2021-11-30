import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { defaults } from "react-chartjs-2";

import Summary from "./Summary";
import ProposerTable from "./ProposerTable";
import BeneficiaryTable from "./BeneficiaryTable";
import { overviewSelector } from "../../store/reducers/overviewSlice";
import { getPrecision, toPrecision } from "../../utils";
import TotalStacked from "./TotalStacked";
import Income from "./Income";
import Output from "./Output";
import { useChainRoute } from "../../utils/hooks";
import { CHAINS } from "../../constants";

const DoughnutWrapper = styled.div`
  display: grid;
  gap: 24px;
  margin-bottom: 24px;
  @media screen and (min-width: 556px) {
    grid-template-columns: repeat(auto-fit, minmax(556px, 1fr));
  }
  @media screen and (max-width: 556px) {
    grid-template-columns: repeat(1fr, minmax(100px, 200px));
  }
`;

const TableWrapper = styled.div`
  margin-top: 24px;
  display: grid;
  gap: 24px;
  @media screen and (min-width: 556px) {
    grid-template-columns: repeat(auto-fit, minmax(556px, 1fr));
  }
  @media screen and (max-width: 556px) {
    grid-template-columns: repeat(auto-fill);
  }
`;

const Overview = () => {
  const overview = useSelector(overviewSelector);

  useChainRoute();

  const precision = getPrecision(CHAINS.EDGEWARE);

  const bountySpent = toPrecision(
    overview.output.bounty || 0,
    precision,
    false
  );
  const proposalSpent = toPrecision(
    overview.output.proposal || 0,
    precision,
    false
  );
  const tipSpent = toPrecision(overview.output.tip || 0, precision, false);
  const burntTotal = toPrecision(overview.output.burnt || 0, precision, false);

  console.log(overview.income);
  const minting = toPrecision(overview.income.minting || 0, precision, false);
  const stakingRemainder = toPrecision(
    overview.income.stakingRemainder || 0,
    precision,
    false
  );
  const slashDemocracy = toPrecision(
    overview.income.slashSeats.democracy || 0,
    precision,
    false
  );
  const slashStaking = toPrecision(
    overview.income.slashSeats.staking || 0,
    precision,
    false
  );
  const slashIdentity = toPrecision(
    overview.income.slashSeats.identity || 0,
    precision,
    false
  );
  const others = toPrecision(overview.income.others || 0, precision, false);

  defaults.global.defaultFontFamily = "Inter";

  return (
    <>
      <Summary />
      <DoughnutWrapper>
        <Income
          minting={minting}
          stakingRemainder={stakingRemainder}
          slashStaking={slashStaking}
          slashDemocracy={slashDemocracy}
          slashIdentity={slashIdentity}
          others={others}
        />
        <Output
          proposals={proposalSpent}
          tips={tipSpent}
          bounties={bountySpent}
          burnt={burntTotal}
        />
      </DoughnutWrapper>
      <TotalStacked />
      <TableWrapper>
        <BeneficiaryTable />
        <ProposerTable />
      </TableWrapper>
    </>
  );
};

export default Overview;
