import React, { useEffect } from "react";
import styled from "styled-components";
import { Menu, Tab } from "semantic-ui-react";
import { NavLink, useLocation } from "react-router-dom";
import TipsMenu from "./TipsMenu";
import ProposalsMenu from "./ProposalsMenu";
import BountiesMenu from "./BountiesMenu";
import DemocracySlashMenu from "./DemocracySlashMenu";
import StakingSlashMenu from "./StakingSlashMenu";
import IdentitySlashMenu from "./IdentitySlashMenu";
import InflationMenu from "./InflationMenu";
import OthersIncomeMenu from "./OthersIncomeMenu";
import ProjectsMenu from "./ProjectsMenu";
import TansfersSlashMenu from "./TansfersSlashMenu";
import { fetchIncomeCount } from "../../store/reducers/incomeSlice";
import { useDispatch, useSelector } from "react-redux";
import { showMenuTabsSelector } from "../../store/reducers/menuSlice";
import { chainSymbolSelector, } from "../../store/reducers/chainSlice";
import Card from "../../components/Card";
import Container from "../../components/Container";

import { PRIMARY_THEME_COLOR, SECONDARY_THEME_COLOR, TEXT_DARK_MAJOR, TEXT_DARK_MINOR, } from "../../constants";
import BreadCrumbs from "./BreadCrumbs";

const Wrapper = styled.div`
  position: relative;
`;

const WrapperBackground = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 42px;
  width: 100%;
  z-index: -1;
`;

const TabWrapper = styled(Tab)`
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  /* scrollbar-width: none; */
  overflow-y: auto;

  background: transparent;

  div {
    border-bottom: 0 !important;
  }

  a {
    padding-left: 0 !important;
    padding-right: 0 !important;
    border-width: 4px !important;
    font-family: "Inter" !important;
    color: ${TEXT_DARK_MINOR} !important;
    margin-right: 32px !important;
    margin-bottom: 0px !important;
    & > div.item {
      margin-bottom: -4px !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      color: ${TEXT_DARK_MINOR} !important;
    }
    & > div.ui.label,
    & > div > div.ui.label {
      background: ${SECONDARY_THEME_COLOR} !important;
      height: 20px !important;
      padding: 0 8px !important;
      line-height: 20px !important;
      border-radius: 10px !important;
      margin-left: 8px !important;
      color: ${PRIMARY_THEME_COLOR} !important;
      font-weight: 400;
    }
    &.active,
    &.active > div {
      font-weight: 600 !important;
      color: ${TEXT_DARK_MAJOR} !important;
      border-color: ${PRIMARY_THEME_COLOR} !important;
    }
    &.item {
      padding: 2px 0 !important;
    }
  }
`;

const CustomCard = styled(Card)`
  padding: 0 24px;
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const TopWrapper = styled.div`
  &, > div {
    display: flex;
    align-items: center;
  }
  height: 43px;
  padding: 11px 0;
  border-bottom: 1px solid #f4f4f4;
  a {
    font-size: 13px;
    line-height: 18px;
    color: rgba(0, 0, 0, 0.3);
    :hover {
      color: ${TEXT_DARK_MINOR};
    }

    text-transform: capitalize;
  }
`;

const OverviewWrapper = styled.div`
  line-height: 22px !important;
`;

const Divider = styled.div`
  position: relative;
  width: 1px;
  height: 20px;
  background: #eeeeee;
  left: 16px;
`;

const Overview = () => {
  return (
    <OverviewWrapper className="item">
      Overview
      <Divider />
    </OverviewWrapper>
  );
};

const Singularize = (plural)=> {
  if(plural.includes('ies')){
    return plural.replace('ies', 'y');
  }
  return plural.slice(0, -1);
}



const TabExampleSecondaryPointing = () => {
  const { pathname } = useLocation();
  const paths = pathname.split('/');
  const dispatch = useDispatch();
  const showMenuTabs = useSelector(showMenuTabsSelector);
  const symbol = useSelector(chainSymbolSelector)?.toLowerCase();
  const breadCrumbs = [];

  const topCategories = [`proposals`, `projects`, "income", "tips", "bounties",];
  if (topCategories.includes(paths[1])) {
    breadCrumbs.push({name:paths[1], to:`/${paths[1]}`})
  }
  if(paths.length > 2) {
    if (paths[1] === `proposals` || paths[1] === `bounties` || paths[1] === `tips`) {
      let index = paths[2];
      if (paths[1] === 'tips') {
        const tipIds = paths[2]?.split("_0x");
        paths?.length > 1 && (index = `${tipIds[1].slice(0, 6)}`);
      }
      breadCrumbs.push({name: `${Singularize(paths[1])} #${index}`, to: pathname})
    }
    if(paths[1] === `projects`){
      breadCrumbs.push({name: paths[2], to: pathname})
    }
    if (paths[1] === 'income') {
      breadCrumbs.push({
        name:`${paths[2] === 'slash' ? `Slash ` + paths[3] : paths[2]}`,
        to:pathname
      });
    }
  }

  useEffect(() => {
    dispatch(fetchIncomeCount());
  }, [dispatch]);

  let panes =
    showMenuTabs === "Home"
      ? [
          {
            menuItem: {
              as: NavLink,
              id: "homeTab",
              content: <Overview />,
              to: ``,
              exact: true,
              key: "home",
              active: `` === pathname,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "proposalsTab",
              content: <ProposalsMenu />,
              to: `/proposals`,
              exact: true,
              key: "proposals",
              active:
                `/proposals` === pathname ||
                pathname.indexOf(`/proposals`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "tipsTab",
              content: <TipsMenu />,
              to: `/tips`,
              exact: true,
              key: "tips",
              active: `/tips` === pathname || pathname.indexOf(`/tips`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "bountiesTab",
              content: <BountiesMenu />,
              to: `/bounties`,
              exact: true,
              key: "bounties",
              active:
                `/bounties` === pathname || pathname.indexOf(`/bounties`) === 0,
            },
          },
        ]
      : showMenuTabs === "Income"
      ? [
          {
            menuItem: {
              as: NavLink,
              id: "inflationTab",
              content: <InflationMenu />,
              to: `/income`,
              exact: true,
              key: "inflation",
              active: `/income` === pathname,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "stakingSlashTab",
              content: <StakingSlashMenu />,
              to: `/income/slash/staking`,
              exact: true,
              key: "stakingSlash",
              active:
                `${symbol}/income/slash/staking` === pathname ||
                pathname.indexOf(`${symbol}/income/slash/staking`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "democracySlashTab",
              content: <DemocracySlashMenu />,
              to: `/income/slash/democracy`,
              exact: true,
              key: "democracySlash",
              active:
                `/income/slash/democracy` === pathname ||
                pathname.indexOf(`/income/slash/democracy`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "identitySlashTab",
              content: <IdentitySlashMenu />,
              to: `/income/slash/identity`,
              exact: true,
              key: "identitySlash",
              active:
                `/income/slash/identity` === pathname ||
                pathname.indexOf(`/income/slash/identity`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "transfersSlashTab",
              content: <TansfersSlashMenu />,
              to: `/income/transfers`,
              exact: true,
              key: "transfersSlash",
              active:
                `/income/transfers` === pathname ||
                pathname.indexOf(`/income/transfers`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "othersIncomeTab",
              content: <OthersIncomeMenu />,
              to: `/income/others`,
              exact: true,
              key: "othersIncome",
              active:
                `/income/others` === pathname ||
                pathname.indexOf(`/income/others`) === 0,
            },
          },
        ]
      : showMenuTabs === "Projects"
      ? [
          {
            menuItem: {
              as: NavLink,
              id: "projectsTab",
              content: <ProjectsMenu />,
              to: `/projects`,
              exact: true,
              key: "projects",
              active:
                `/projects` === pathname || pathname.indexOf(`/projects`) === 0,
            },
          },
        ]
      : [];
  if(pathname.includes('/proposals/')
    ||pathname.includes('/projects/')
    ||pathname.includes('/bounties/')
    ||pathname.includes('/tips/')){
    panes = [
      {
        menuItem: {
          as: NavLink,
          id: "detailTab",
          content: <Menu.Item key="Detail">
            Detail
          </Menu.Item>,
          to: `#`,
          exact: true,
          key: "detail",
          active:true,
        },
      },
    ];
  }

  return (
    <Wrapper>
      <WrapperBackground symbol={symbol} />
      <Container>
        <CustomCard>
          <TopWrapper>
            <BreadCrumbs breadCrumbs={breadCrumbs}/>
          </TopWrapper>
          <TabWrapper
            menu={{ secondary: true, pointing: true }}
            panes={panes}
            activeIndex={"tipsTab"}
          />
        </CustomCard>
      </Container>
    </Wrapper>
  );
};

export default TabExampleSecondaryPointing;
