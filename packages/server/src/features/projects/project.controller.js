const edgProjects = require("./data");
const { extractPage } = require("../../utils");

function sum(arr) {
  return arr.reduce((previous, current) => previous + current, 0);
}

function calc(projects) {
  projects.forEach((project) => {
    const proposals = project.proposals ?? [];
    project.proposalsCount = proposals.length;
    project.expense = sum(proposals.map((p) => p.amount));
    project.dollar = sum(
      (project.proposals || []).map(
        (p) => (p.amount ?? 0) * (p.proposeTimePrice ?? 0)
      )
    );
  });
}

calc(edgProjects);

const projects = () => edgProjects;

class ProjectController {
  async getProjects(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const total = projects().length;
    const skip = page * pageSize;

    ctx.body = {
      items: projects()
        .slice(skip, skip + pageSize)
        .map((item) => ({
          id: item.id,
          name: item.name,
          logo: item.logo,
          title: item.title,
          description: item.description,
          startTime: item.startTime,
          endTime: item.endTime,
          proposals: item.proposals?.length ?? 0,
          proposalsCount: item.proposalsCount,
          expense: item.expense,
          dollar: item.dollar,
        })),
      page,
      pageSize,
      total,
    };
  }

  async getProject(ctx) {
    const projectId = ctx.params.projectId;
    const project = projects().find(
      (p) =>
        (p.id || "").toLocaleLowerCase() === (projectId || "").toLowerCase()
    );
    if (!project) {
      ctx.status = 404;
      return;
    }

    ctx.body = project;
  }
}

module.exports = new ProjectController();
