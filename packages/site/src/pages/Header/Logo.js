import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
`;

const ImgFullWrapper = styled.div`
  display: block;
  @media screen and (max-width: 500px) {
    display: none;
  }
`;

const ImgShortWrapper = styled.div`
  display: none;
  @media screen and (max-width: 500px) {
    display: block;
  }
`;

const Divider = styled.div`
  background: #525252;
  margin: 0 12px;
  width: 1px;
  height: 12px;
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 28px;
  color: #ffffff;
`;

const Logo = ({ symbol }) => (
  <Wrapper>
    <ImgFullWrapper>
      <Image src="/imgs/logotype-edgeware.svg" />
    </ImgFullWrapper>
    <ImgShortWrapper>
      <Image src="/imgs/logo-edgeware.svg" height={32} />
    </ImgShortWrapper>
    <Divider />
    <Label>Treasury</Label>
  </Wrapper>
);

export default Logo;
