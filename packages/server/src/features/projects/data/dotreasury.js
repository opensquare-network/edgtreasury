const id = "dotreasury";
const name = "doTreasury";
const title =
  "doTreasury is now a substrate based chains treasury explorer which will try to introduce retrospect mechanism to current treasury mechanism.";
const description = `doTreasury aim to introduce remarks from councilors and communities to improve current kusama/polkadot treasury with a retrospect mechanism.`;
const startTime = 1635854238006;
const logo = "dotreasury-logo.svg";

const relatedLinks = [
  {
    link: "https://www.dotreasury.com",
    description: "Dotreasury Website",
  },
  {
    link: "https://github.com/opensquare-network/edgtreasury",
    description: "Github Repo",
  },
];

const proposals = [
  {
    amount: 1463000,
    proposalId: 40,
    proposeTimePrice: 0.015323,
    title: "Edgeware integration",
    achievements: [
      "Integrate edgeware to dotreasury",
      "Support treasury income/output and funded projects",
    ],
  },
]

module.exports = {
  id,
  name,
  logo,
  startTime,
  title,
  description,
  proposals,
  relatedLinks,
};
