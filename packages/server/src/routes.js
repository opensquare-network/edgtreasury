const Router = require("koa-router");

const router = new Router();

const chainFeatureRouters = [
  require("./features/status/routes"),
  require("./features/tips/routes"),
  require("./features/proposals/routes"),
  require("./features/bounties/routes"),
  require("./features/burnt/routes"),
  require("./features/income/routes"),
  require("./features/stats/routes"),
  require("./features/projects/routes"),
  require("./features/outputtransfers/routes"),
];

const commonFeatureRouters = [
  require("./features/scan/routes"),
];

module.exports = (app) => {
  for (const r of commonFeatureRouters) {
    router.use(r.routes(), r.allowedMethods({ throw: true }));
  }
  for (const r of chainFeatureRouters) {
    router.use(r.routes(), r.allowedMethods({ throw: true }));
  }
  app.use(router.routes());
};
