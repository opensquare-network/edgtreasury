import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { toLocaleStringWithFixed } from "../../utils";

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 214px;
`;

const TextBold = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  line-height: 32px;
`;

const TextMinorBold = styled(TextMinor)`
  font-size: 18px;
  font-weight: 700;
  line-height: 32px;
  margin-left: 8px;
`;

const TotalText = styled(TextMinor)`
  text-align: center;
`;

const ZindexWrapper = styled.div`
  z-index: 999;
`;

const Total = ({ total, children }) => {
  const symbol = useSelector(chainSymbolSelector);
  total = toLocaleStringWithFixed(total, 2).replace(/\D00/, "");
  return (
    <Wrapper>
      {children}
      <ZindexWrapper>
        <TextWrapper>
          <TextBold>{total}</TextBold>
          <TextMinorBold>{symbol}</TextMinorBold>
        </TextWrapper>
        <TotalText>Total amount</TotalText>
      </ZindexWrapper>
    </Wrapper>
  );
};

export default Total;
