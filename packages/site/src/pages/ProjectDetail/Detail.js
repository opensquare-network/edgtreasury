import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Card from "../../components/Card";
import Title from "../../components/Title";
import TextMinor from "../../components/TextMinor";

const Wrapper = styled(Card)`
  padding: 24px 32px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  @media screen and (max-width: 481px) {
    & * {
      text-align: left !important;
    }
  }
`;

const IconImage = styled(Image)`
  margin-right: 32px;
`;

const NameContentWrapper = styled.div`
  flex: 1 1 774px;
`;

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const NameTitle = styled(Title)`
  font-size: 22px;
  font-weight: 700;
  line-height: 36px;
`;

const NameContent = styled(TextMinor)`
  text-align: justify;
`;

const Detail = ({ data }) => {
  const { name, logo, description } = data;

  return (
    <Wrapper>
      <IconImage
        src={logo ? `/imgs/projects/${logo}` : "/imgs/default-logo.svg"}
        width={96}
        height={96}
      />
      <NameContentWrapper>
        <NameWrapper>
          <NameTitle>{name}</NameTitle>
        </NameWrapper>
        <NameContent>{description}</NameContent>
      </NameContentWrapper>
    </Wrapper>
  );
};

export default Detail;
