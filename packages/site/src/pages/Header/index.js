import React from "react";
import styled from "styled-components";

import Container from "../../components/Container";
import MainHeader from "./MainHeader";
import SubHeader from "./SubHeader";

const Wrapper = styled.header`
  background-image: url("/imgs/bg-edgewa.png");
  max-height: 136px;
  margin-bottom: -43px;
  padding-bottom: 43px;
`;

const Header = () => {
  return (
    <>
      <Wrapper>
        <Container>
          <MainHeader />
        </Container>
      </Wrapper>
      <SubHeader />
    </>
  );
};

export default Header;
