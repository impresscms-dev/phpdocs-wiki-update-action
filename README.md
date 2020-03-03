[![License](https://img.shields.io/github/license/imponeer/phpdocs-wiki-update-action.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/release/imponeer/phpdocs-wiki-update-action.svg)](https://github.com/imponeer/phpdocs-wiki-update-action/releases)

# Update wiki with PHP project documentation action

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

| Argument | Required | Default value | Description |
|----------|----------|---------------|-------------|
| wiki_github_update_token | Yes | | GitHub token to use for updating project wiki |
| wiki_github_update_user | Yes | | GitHub username for whom this token belongs |
| temp_docs_folder | No | .docs | Temporally folder name for store generated project documentation |
| engine | No | clean/phpdoc-md | What documentation generator should be used? See [engines section](#engines) about possible values |
| prefix_lines | No | `##### Notice: Wiki was automatic generated from project sources as project API documentation. Do not edit manually!` | Lines that will be used to prefix generated wiki content |

Some engines supports or requires extra parameters. See [engines section](#engines) about more info.

## Engines

Update wiki with PHP project documentation action supports multiple engines for generating content. Usually names for engines are same as composer packages that they are using.

### `clean/phpdoc-md` [🔗](https://github.com/clean/phpdoc-md)

This engine is default for the action. It needs to specify classes that should be included in generated wiki code, but it works much faster than `evert/phpdoc-md`. Sadly, not for every project right now is possible to use this one.

This engine supports such extra arguments:
| Argument | Required | Default value | Description |
|----------|----------|---------------|-------------|
| class_root_namespace | No | | Root class namespace that should be used for documentation |
| include | No | | Defines what classes should be included in generated documentation (supports glob style wildcards syntax; each line means one rule) |

### `evert/phpdoc-md` [🔗](https://github.com/evert/phpdoc-md)

This engine first generates an XML data tree with the help of PHPDocumentator and then it is converted to MarkDown format, which is then uploaded to a project wiki. That's why is much slower than `clean/phpdoc-md` but generates much better results.

This engine supports such extra arguments:
| Argument | Required | Default value | Description |
|----------|----------|---------------|-------------|
| ignore_files | No | | Defines files that can be ignored (supports glob rules; each line means one rule) |

## How to contribute? 

If you want to add some functionality or fix bugs, you can fork, change and create pull request. If you not sure how this works, try [interactive GitHub tutorial](https://try.github.io).

If you found any bug or have some questions, use [issues tab](https://github.com/imponeer/phpdocs-wiki-update-action/issues) and write there your questions.
