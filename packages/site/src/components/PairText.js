import React from "react";
import styled from "styled-components";

import Text from "./Text";
import TextMinor from "./TextMinor";

const Wrapper = styled.div`
  p {
    display: inline;
    :last-child {
      margin-left: 4px;
    }
  }
`;

const PairText = ({ value, unit }) => {
  return (
    <Wrapper>
      <Text>{value}</Text>
      <TextMinor>{unit}</TextMinor>
    </Wrapper>
  );
};

export default PairText;
