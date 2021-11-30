export const TEXT_DARK_MAJOR = "#1D253C";
export const TEXT_DARK_MINOR = "rgba(29, 37, 60, 0.64)";
export const TEXT_DARK_DISABLE = "rgba(29, 37, 60, 0.24)";
export const PRIMARY_THEME_COLOR = "#DF405D";
export const SECONDARY_THEME_COLOR = "#FFEEF1";
export const WARNING_COLOR = "#EC4730";

export const OVERVIEW_PROPOSALS_COLOR = "#FF3B80";
export const OVERVIEW_TIPS_COLOR = "#2DE1C5";
export const OVERVIEW_BOUNTIES_COLOR = "#11CAF0";
export const OVERVIEW_BURNT_COLOR = "#FFC008";
export const OVERVIEW_INFLATION_COLOR = "#DF405D";
export const OVERVIEW_TREASURY_COLOR = "#FCC04D";
export const OVERVIEW_ELECTION_COLOR = "#FED077";
export const OVERVIEW_OTHERS_COLOR = "#CCCCCC";
export const OVERVIEW_MINTING_COLOR = "#FF3B80";
export const OVERVIEW_STAKING_REMINDER_COLOR = "#FB6C9F";
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
  "F3opxRbN5ZbjJNU511Kj2TLuzFcDq9BGduA9TgiECafpg29";

export const REACTION_THUMBUP = 1;
export const REACTION_THUMBDOWN = 2;

export const DEFAULT_KUSAMA_NODE_URL = "wss://pub.elara.patract.io/kusama";
export const DEFAULT_KUSAMA_NODES = [
  {
    name: "Parity",
    url: "wss://kusama-rpc.polkadot.io",
  },
  {
    name: "OnFinality",
    url: "wss://kusama.api.onfinality.io/public-ws",
  },
  {
    name: "Patract Elara",
    url: "wss://pub.elara.patract.io/kusama",
  },
];

export const DEFAULT_POLKADOT_NODE_URL = "wss://rpc.polkadot.io/";
export const DEFAULT_POLKADOT_NODES = [
  {
    name: "Parity",
    url: "wss://rpc.polkadot.io/",
  },
  {
    name: "OnFinality",
    url: "wss://polkadot.api.onfinality.io/public-ws",
  },
  {
    name: "Patract Elara",
    url: "wss://pub.elara.patract.io/polkadot",
  },
];

export const CHAINS = {
  POLKADOT: "dot",
  KUSAMA: "ksm",
  EDGEWARE: "edg",
};
