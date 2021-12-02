import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const PlusWrapper = styled.div`
  font-size: 14px !important;
  line-height: 22px !important;
  color: rgba(0, 0, 0, 0.3) !important;
  margin: 0 4px !important;
  font-weight: 400 !important;
  :first-child {
    display: none;
  }
  :last-child {
    display: none;
  }
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
        </Item>
      )}
    </Wrapper>
  );
}
