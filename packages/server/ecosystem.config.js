const common = {
  log_date_format: "YYYY-MM-DD HH:mm Z",
  env: {
    NODE_ENV: "development",
  },
  env_production: {
    NODE_ENV: "production",
  },
}

const commonPart = {
  script: "src/index.js",
  ...common,
};

module.exports = {
  apps: [
    {
      name: "edgTreasury-api-dev",
      ...commonPart,
    },
    {
      name: "edgTreasury-api-prod",
      ...commonPart,
    },
  ],
};
