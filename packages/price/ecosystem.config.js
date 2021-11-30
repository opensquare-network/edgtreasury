module.exports = {
  apps: [
    {
      name: "edg-price-tracker",
      script: "src/index.js",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "edg-price-sync",
      script: "src/calcprice/index.js",
      cron_restart: "*/1 * * * *",
      autorestart: false,
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
