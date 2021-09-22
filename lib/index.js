import { run } from "./discussion-bot";
const core = require("@actions/core");

try {
  const inputs = {
    token: core.getInput("token", { required: true }),
    title: core.getInput("title", { required: true }),
    category: core.getInput("category", { required: true }),
    body: core.getInput("body", { required: true }),
    repository: core.getInput("repository", { required: true }),
  };

  run(inputs);
} catch (error) {
  core.setFailed(error);
}
