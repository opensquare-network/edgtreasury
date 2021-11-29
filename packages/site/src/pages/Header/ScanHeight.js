import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Image } from "semantic-ui-react";
import Card from "../../components/Card";
import { TEXT_DARK_MAJOR } from "../../constants";
import { chainSelector } from "../../store/reducers/chainSlice";
import {
  currentNodeSelector,
  setCurrentNode,
  nodesSelector,
} from "../../store/reducers/nodeSlice";
import { useOutsideClick } from "../../utils/hooks";
import useUpdateNodesDelay from "../../utils/useUpdateNodesDelay";
import { addToast } from "../../store/reducers/toastSlice";

const NetworkWrapper = styled.div`
  position: relative;
  display: flex;
  @media screen and (max-width: 600px) {
    position: static;
  }
`;

const NetworkButton = styled.button`
  flex: 0 0 auto;
  border: 1px solid #f4f4f4;
  border-radius: 4px;
  background-color: #fff;
  padding: 4px;
  cursor: pointer;
  :hover {
    background: #fafafa;
  }
  ${(p) =>
    p.isActive &&
    css`
      background: #fafafa;
    `}
`;

const NetworkItemWrapper = styled(Card)`
  position: absolute;
  padding: 4px 0;
  right: 0;
  top: calc(100% + 8px);
  width: 240px;
  z-index: 999;
  @media screen and (max-width: 600px) {
    width: 100vw;
    left: 0;
    top: 100%;
    border-radius: 0;
    padding: 8px 0;
  }
`;

const NetworkItem = styled.div`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  line-height: 18px;
  color: ${TEXT_DARK_MAJOR};
  :hover {
    background: #fafafa;
  }
  ${(p) =>
    p.isActive &&
    css`
      background: #fafafa;
    `}
  ${(p) =>
    p.delay &&
    typeof p.delay === "number" &&
    p.delay >= 0 &&
    css`
      > .delay {
        color: #3abc3f;
      }
    `}
  ${(p) =>
    p.delay &&
    typeof p.delay === "number" &&
    p.delay >= 100 &&
    css`
      > .delay {
        color: #ee7735;
      }
    `}
  ${(p) =>
    p.delay &&
    typeof p.delay === "number" &&
    p.delay >= 300 &&
    css`
      > .delay {
        color: #ec4730;
      }
    `}
  @media screen and (max-width: 600px) {
    padding: 11px 24px;
  }
`;

const ScanHeight = () => {
  useUpdateNodesDelay();
  const dispatch = useDispatch();
  const chain = useSelector(chainSelector);
  const currentNodeSetting = useSelector(currentNodeSelector);
  const nodesSetting = useSelector(nodesSelector);
  const [networkOpen, setNetorkOpen] = useState(false);
  const netWorkRef = useRef(null);

  const currentNetwork = nodesSetting?.[chain]?.find(
    (item) => item.url === currentNodeSetting?.[chain]
  );
  let currentNetworkImg = "/imgs/node-signal-disabled.svg";
  if (currentNetwork && currentNetwork.delay) {
    if (currentNetwork.delay >= 300) {
      currentNetworkImg = "/imgs/node-signal-slow.svg";
    } else if (currentNetwork.delay >= 100) {
      currentNetworkImg = "/imgs/node-signal-medium.svg";
    } else if (currentNetwork.delay >= 0) {
      currentNetworkImg = "/imgs/node-signal-fast.svg";
    }
  }

  useOutsideClick(netWorkRef, () => {
    setNetorkOpen(false);
  });

  const switchNetwork = (url) => {
    if (url && url === currentNetwork?.url) return;
    dispatch(
      setCurrentNode({
        chain,
        url,
      })
    );
    const nodeName = nodesSetting[chain].find((item) => item.url === url)?.name;
    dispatch(
      addToast({
        type: "success",
        message: `Node switched to ${nodeName}!`,
      })
    );
  };

  return (
    <NetworkWrapper>
      <NetworkButton
        isActive={networkOpen}
        ref={netWorkRef}
        onClick={() => {
          setNetorkOpen(!networkOpen);
        }}
      >
        <Image src={currentNetworkImg} />
        {networkOpen && (
          <NetworkItemWrapper>
            {(nodesSetting?.[chain] || []).map((item, index) => (
              <NetworkItem
                key={index}
                delay={item.delay}
                onClick={() => switchNetwork(item.url)}
                isActive={item.name === currentNetwork?.name}
              >
                <div>Hosted by {item.name}</div>
                {item.delay !== null &&
                  item.delay !== undefined &&
                  !isNaN(item.delay) && (
                    <div className="delay">{item.delay} ms</div>
                  )}
              </NetworkItem>
            ))}
          </NetworkItemWrapper>
        )}
      </NetworkButton>
    </NetworkWrapper>
  );
};

export default ScanHeight;
