import { run } from "./discussion-bot";
const core = require("@actions/core");

try {
  const inputs = {
    token: core.getInput("token"),
    title: core.getInput("title"),
    category: core.getInput("category"),
    body: core.getInput("body"),
    repository: core.getInput("repository"),
  };

  run(inputs);
} catch (error) {
  core.setFailed(error);
}
