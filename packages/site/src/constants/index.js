export const TEXT_DARK_MAJOR = "#1D253C";
export const TEXT_DARK_MINOR = "rgba(0, 0, 0, 0.65)";
export const TEXT_DARK_ACCESSORY = "rgba(0, 0, 0, 0.3)";
export const TEXT_DARK_DISABLE = "rgba(29, 37, 60, 0.24)";
export const PRIMARY_THEME_COLOR = "#FF3B80";
export const SECONDARY_THEME_COLOR = "#FBEAF0";
export const WARNING_COLOR = "#EC4730";

export const OVERVIEW_PROPOSALS_COLOR = "#FF3B80";
export const OVERVIEW_TIPS_COLOR = "#2DE1C5";
export const OVERVIEW_BOUNTIES_COLOR = "#11CAF0";
export const OVERVIEW_BURNT_COLOR = "#FFC008";
export const OVERVIEW_INFLATION_COLOR = "#FF3B80";
export const OVERVIEW_TREASURY_COLOR = "#FCC04D";
export const OVERVIEW_ELECTION_COLOR = "#FED077";
export const OVERVIEW_OTHERS_COLOR = "#CCCCCC";
export const OVERVIEW_MINTING_COLOR = "#FF3B80";
export const OVERVIEW_STAKING_REMAINDER_COLOR = "#FB6C9F";
export const OVERVIEW_STAKING_COLOR = "#2DE1C5";
export const OVERVIEW_DEMOCRACY_COLOR = "#6CEAD6";
export const OVERVIEW_IDENTITY_COLOR = "#96F0E2";

export const TipStatus = {
  Tipping: "Tipping",
  Closing: "Closing",
  Closed: "Closed",
  Retracted: "Retracted",
};

export const tipStatusMap = {
  NewTip: "Tipping",
  tip: "Tipping",
  TipRetracted: "Retracted",
  TipClosed: "Closed",
};

export const ProposalStatus = {
  Approved: "Approved",
  Rejected: "Rejected",
};

export const TreasuryAccount =
  "jz77v8cHXwEWbPnbfQScXnU9Qy5VkHnDLfpDsuDYUZ7ELae";

export const REACTION_THUMBUP = 1;
export const REACTION_THUMBDOWN = 2;

export const DEFAULT_EDGEWARE_NODE_URL =
  "wss://edgeware.api.onfinality.io/public-ws";
export const DEFAULT_EDGEWARE_NODES = [
  {
    name: "onFinality",
    url: "wss://edgeware.api.onfinality.io/public-ws",
  },
  {
    name: "Commonwealth",
    url: "wss://mainnet1.edgewa.re",
  },
];

export const CHAINS = {
  EDGEWARE: "edg",
};
