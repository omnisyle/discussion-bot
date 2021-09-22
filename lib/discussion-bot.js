const core = require("@actions/core");
const { getOctokit } = require("@actions/github");
const { format } = require("date-fns");
const handlebars = require("handlebars");
let octokit;

const getRepoInformation = async (repoOwner, repoName) => {
  core.info(`Getting repo info for ${repoOwner}/${repoName}`);

  const query = `
    query GetRepoInfo($repoName: String!, $repoOwner: String!) {
      repository(name: $repoName, owner: $repoOwner) {
        id
        discussionCategories(first: 10) {
          # type: DiscussionConnection
          totalCount # Int!
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  `;

  const repoInfoResp = await octokit.graphql(query, {
    repoName,
    repoOwner,
  });

  return repoInfoResp.data.repository;
};

const searchForCategory = (categoryName, repoInfo) => {
  core.info(`Searching for category with name ${categoryName}`);

  const categories = repoInfo.discussionCategories.edges;

  const foundNode = categories.find((edge) => {
    const node = edge.node;

    if (node.name === categoryName) {
      return node;
    }
  });

  return foundNode;
};

const createNewDiscussion = async ({
  repositoryId,
  categoryId,
  title,
  body,
}) => {
  core.info(`Creating new discussion with options: ${JSON.stringify(options)}`);

  const query = `
    mutation CreateDiscussion($input: CreateDiscussionInput!) {
      # input type: CreateDiscussionInput
      createDiscussion(input: $input) {

        # response type: CreateDiscussionPayload
        discussion {
          id
          number
          url
        }
      }
    }
  `;

  const createDiscussionResp = await octokit.graphql(query, {
    repositoryId,
    categoryId,
    body,
    title,
  });

  const discussion = createDiscussionResp.data.createDiscussion.discussion;

  return discussion;
};

const compileTemplate = (template) => {
  return handlebars.compile(template)({
    todayDate: format(new Date(), "PPP"),
  });
};

/**
 * Takes provided inputs, acts on them, and produces a single output.
 * See action.yml for input descriptions.
 * @param {object} inputs
 */
const run = async (inputs) => {
  try {
    octokit = getOctokit(inputs.token);

    const titleContent = compileTemplate(inputs.title);
    const bodyContent = compileTemplate(inputs.body);

    const [repoOwner, repoName] = inputs.repository.split("/");

    const repoInfo = await getRepoInformation(repoOwner, repoName);
    const category = searchForCategory(inputs.category, repoInfo);

    const discussion = await createNewDiscussion({
      repositoryId: repoInfo.id,
      categoryId: category.id,
      title: titleContent,
      body: bodyContent,
    });

    core.info(`Discussion created with id: ${discussion.id}`);
  } catch (error) {
    core.setFailed(`Error encountered: ${error}.`);
  }
};

exports.run = run;
