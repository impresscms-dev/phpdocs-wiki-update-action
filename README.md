[![License](https://img.shields.io/github/license/imponeer/phpdocs-wiki-update-action.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/release/imponeer/phpdocs-wiki-update-action.svg)](https://github.com/imponeer/phpdocs-wiki-update-action/releases)

# Update wiki with PHP project documentation

Updates GitHub project wiki with automatic generated project documentation.

## Usage

Before starting to use this action make sure that `Wiki` is enabled in project settings and at least one page there exist.

To use this action in your project, create workflow in your project similar
to this code (Note: some parts and arguments needs to be altered):
```yaml
name: Automatic update project documentation

on:
  push:
    branches:
      - master
    tags:
      - 'v*'
    paths:
      - '**.php'

jobs:
  update_wiki:
    runs-on: ubuntu-latest
    steps:
      - name: Checkouting project code...
        uses: actions/checkout@v2
      - name: Updating wiki...
        uses: impresscms-dev/phpdocs-wiki-update-action
        with:
          wiki_github_update_token: ${{ secrets.WIKI_GITHUB_UPDATE_TOKEN }}
          wiki_github_update_user: ${{ secrets.WIKI_GITHUB_UPDATE_USER }}
          engine: clean/phpdoc-md
          class_root_namespace: My Project
          include: |
            \\MyProject\\**\\
```

## Arguments 

This action supports such arguments (used in `with` keyword):

| Argument | Required | Default value | Used for engine | Description |
|----------|----------|---------------|--------|-------------|
| wiki_github_update_token | Yes | | *all* | GitHub token to use for updating project wiki |
| wiki_github_update_user | Yes | | *all* | GitHub username for whom this token belongs |
| temp_docs_folder | No | .docs | *all* | Temporally folder name for store generated project documentation |
| engine | No | clean/phpdoc-md | *all* | What documentation generator should be used? At current moment [clean/phpdoc-md](https://github.com/clean/phpdoc-md) and [evert/phpdoc-md](https://github.com/evert/phpdoc-md) are supported. |
| class_root_namespace | No | | clean/phpdoc-md | Root class namespace that should be used for documentation |
| include | No | | clean/phpdoc-md | Defines what classes should be included in generated documentation (supports glob style wildcards syntax; each line means one rule) |
| prefix_lines | No | `##### Notice: Wiki was automatic generated from project sources as project API documentation. Do not edit manually!` | *all* | Lines that will be used to prefix generated wiki content |
| ignore_files | No | | evert/phpdoc-md | Defines files that can be ignored (supports glob rules; each line means one rule) |

## How to contribute? 

If you want to add some functionality or fix bugs, you can fork, change and create pull request. If you not sure how this works, try [interactive GitHub tutorial](https://try.github.io).

If you found any bug or have some questions, use [issues tab](https://github.com/imponeer/phpdocs-wiki-update-action/issues) and write there your questions.
