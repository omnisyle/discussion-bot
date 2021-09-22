# Discussion Bot

Automatically create a discussion topic in Github discussion on a pre-defined schedule.

This is mainly use to create standups discussion.
Example workflow setting:

```yaml

# This is a basic workflow to help you get started with Actions

name: Discussion Bot

# Controls when the workflow will run
on:
  # Triggers the workflow on push or pull request events but only for the master branch
  schedule:
  - cron: '0 08 * * 1,3'

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: omnisyle/discussion-bot@master
        with:
          token: ${{ secrets.YOUR_PERSONAL_TOKEN }}
          category: 'Standups'
          repository: ${{ github.repository }}
          title: 'Standup thread {{todayDate}}'
          body: |-
            ## Standup for {{todayDate}}
            Share your daily standup update here. Respond to this discussion before your standup starts in the following format:

            ```
            **Yesterday**
            -

            **Today**
            -

            **Blockers**
            -
            ```

```
