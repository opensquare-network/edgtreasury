import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Container from "../../components/Container";
import TextMinor from "../../components/TextMinor";
import { TEXT_DARK_MAJOR, TEXT_DARK_MINOR } from "../../constants";

const Wrapper = styled.footer`
  padding-bottom: 20px;
`;

const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 24px;
  }
  > :last-child {
    margin-left: auto;
  }
  .link {
    cursor: pointer;
    :hover {
      color: ${TEXT_DARK_MAJOR};
      text-decoration: underline;
    }
  }
  .small {
    display: none;
    margin-bottom: 4px;
  }
  @media screen and (max-width: 1140px) {
    flex-direction: column;
    justify-content: center;
    > * {
      margin: 0 !important;
    }
    > :not(:first-child) {
      margin-top: 4px !important;
    }
    > :last-child {
      margin: 4px auto 0 !important;
    }
    .hidden {
      display: none;
    }
    .small {
      display: block;
    }
  }
`;

const IconList = styled.div`
  margin-left: auto !important;
  display: inline-flex;
  align-items: center;
  > a {
    height: 24px;
  }
  > :not(:first-child) {
    margin-left: 16px;
  }
  i {
    font-size: 20px;
    color: rgba(29, 37, 60, 0.24);

    &:hover {
      color: ${TEXT_DARK_MINOR};
    }
  }
`;

const ImageLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 8px;
  }
  @media screen and (max-width: 481px) {
    flex-direction: column;
    > :not(:first-child) {
      margin-left: 0;
      margin-top: 4px;
    }
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const Footer = () => {
  return (
    <Wrapper>
      <Container>
        <FooterWrapper>
          <ImageLogoWrapper>
            <TextMinor>
              Edgeware Treasury © {new Date().getFullYear()} - Powered By
            </TextMinor>
            <a
              href="https://www.opensquare.network/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/imgs/opensquare-logo.svg" />
            </a>
          </ImageLogoWrapper>
          <IconList>
            <a
              href="https://edgewa.re/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon src="/imgs/icon-edgeware.svg" />
            </a>
            <a
              href="https://github.com/opensquare-network"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon src="/imgs/icon-github.svg" />
            </a>
          </IconList>
        </FooterWrapper>
      </Container>
    </Wrapper>
  );
};

export default Footer;
