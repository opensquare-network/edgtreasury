const Router = require("koa-router");
const bountiesController = require("./bounties.controller");

const router = new Router();

router.get("/bounties", bountiesController.getBounties);
router.get("/bounties/:bountyIndex", bountiesController.getBountyDetail);

router.get("/bounties/:bountyIndex/links", bountiesController.getBountyLinks);
router.post(
  "/bounties/:bountyIndex/links",
  bountiesController.createBountyLink
);
router.delete(
  "/bounties/:bountyIndex/links/:linkIndex",
  bountiesController.deleteBountyLink
);

module.exports = router;
