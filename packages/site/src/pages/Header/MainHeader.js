import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Logo from "./Logo";
import { NavLink } from "react-router-dom";
import ScanHeight from "./ScanHeight";
import MenuSwitch from "./MenuSwitch";
import { useMenuTab } from "../../utils/hooks";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";

const Wrapper = styled.header`
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  @media screen and (max-width: 600px) {
    padding: 0 24px;
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Left = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  button.ui {
    background-color: transparent !important;
  }

  a > div > button {
    @media screen and (min-width: 850px) {
      color: #fff !important;
    }
  }
  a > button {
    @media screen and (min-width: 850px) {
      color: #fff !important;
    }
  }
  > a {
    margin-right: 40px !important;
  }

  @media screen and (max-width: 850px) {
    box-shadow: 0px 4px 12px rgba(29, 37, 60, 0.08);
    display: none;
    width: 100vw;
    flex-direction: column;
    position: absolute;
    left: -16px;
    top: 69px;
    z-index: 9999;
    background-color: white;
    padding: 22px 0;
    border-bottom: 1px solid #eeeeee;
    > * {
      margin-top: 8px;
      &:first-child {
        margin-top: 0;
      }
    }
    > a div,
    > a button {
      margin-right: 0 !important;
    }
    > .button button {
      width: 83vw;
    }
    > div {
      margin-right: 0 !important;
    }
    > a {
      margin-right: 0 !important;
    }
  }
  @media screen and (max-width: 600px) {
    left: 0;
  }
`;

const MenuIcon = styled.div`
  width: 24px;
  height: 24px;
  display: none !important;
  margin-left: 12px;
  flex-shrink: 0;
  @media screen and (max-width: 850px) {
    display: flex !important;
    cursor: pointer;
    align-items: center;
    justify-content: center;
  }
`;

const MainHeader = () => {
  const symbol = useSelector(chainSymbolSelector)?.toLowerCase();
  const [menuShow, setMenuShow] = useState(false);
  useMenuTab();

  const menuWrap = useRef();
  const menuClick = (e) => {
    if (e.target !== menuWrap.current) {
      setMenuShow(false);
    }
  };
  let menuIconSrc = "/imgs/icon-ham-white.svg";
  if (menuShow) {
    menuIconSrc = "/imgs/menu-icon-close-white.svg";
  }
  return (
    <Wrapper>
      <Left>
        <NavLink to="/">
          <Logo />
        </NavLink>
      </Left>
      <FlexWrapper>
        <Right
          symbol={symbol}
          style={{ display: menuShow ? "flex" : "" }}
          onClick={menuClick}
          ref={menuWrap}
        >
          <NavLink to={`/income`}>
            <MenuSwitch menuTabsName="Income" />
          </NavLink>
          <NavLink to={`/projects`}>
            <MenuSwitch menuTabsName="Projects" />
          </NavLink>
        </Right>
        <ScanHeight />
        <MenuIcon onClick={() => setMenuShow(!menuShow)}>
          <Image src={menuIconSrc} />
        </MenuIcon>
      </FlexWrapper>
    </Wrapper>
  );
};

export default MainHeader;
