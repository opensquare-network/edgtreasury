const Router = require("koa-router");
const projectsController = require("./project.controller");

const router = new Router();
router.get("/projects", projectsController.getProjects);
router.get("/projects/:projectId", projectsController.getProject);

module.exports = router;
