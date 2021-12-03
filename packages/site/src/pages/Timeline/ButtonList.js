import React from "react";
import styled, { css } from "styled-components";

import ImageButton from "./ImageButton";
import ExplorerLink from "../../components/ExplorerLink";
import { mrgap } from "../../styles";
import { useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";

const Wrapper = styled.div`
  margin-top: 8px;
  display: flex;
  ${css`
    ${mrgap("8px")}
  `}
`;

const ButtonList = ({ extrinsicIndexer, eventIndexer }) => {
  const chain = useSelector(chainSelector);

  const blockHeight = (extrinsicIndexer || eventIndexer)?.blockHeight;
  const extrinsicIndex =
    (extrinsicIndexer || eventIndexer)?.extrinsicIndex || 0;
  const eventSort = eventIndexer?.eventIndex;

  const isExtrinsic = !!extrinsicIndexer;
  const subscanLink = isExtrinsic
    ? `extrinsic/${blockHeight}-${extrinsicIndex}`
    : `extrinsic/${blockHeight}-${extrinsicIndex}?event=${blockHeight}-${eventSort}`;

  return (
    <Wrapper>
      <ExplorerLink base={`https://${chain}.subscan.io/`} href={subscanLink}>
        <ImageButton src={"/imgs/subscan-logo.svg"} />
      </ExplorerLink>
    </Wrapper>
  );
};

export default ButtonList;
