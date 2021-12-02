import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
`;


const Item = styled.div`
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  > img {
    margin-left: 4px;
  }
`;

export default function ProjectProposals({proposalsCount}) {
  return (
    <Wrapper>
      {proposalsCount > 0 && (
        <Item>
          {proposalsCount}
          {/*<Image src="/imgs/logo-kusama.svg" />*/}
        </Item>
      )}
    </Wrapper>
  );
}
