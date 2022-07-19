# Update wiki with PHP project documentation action

[![License](https://img.shields.io/github/license/impresscms-dev/phpdocs-wiki-update-action.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/release/impresscms-dev/phpdocs-wiki-update-action.svg)](https://github.com/impresscms-dev/phpdocs-wiki-update-action/releases) [![Maintainability](https://api.codeclimate.com/v1/badges/4fd000d25f3d24e04752/maintainability)](https://codeclimate.com/github/impresscms-dev/phpdocs-wiki-update-action/maintainability) 

Updates GitHub project wiki with automatic generated project documentation.

Works only if project has definitions in [composer.json](https://getcomposer.org/doc/01-basic-usage.md).

## Usage

**Before starting to use this action make sure:** 
* `Wiki` is enabled in project settings 
* at least one page in project Wiki exist

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

jobs:
  update_wiki:
    runs-on: ubuntu-latest
    steps:
      - name: Checkouting project code...
        uses: actions/checkout@v2
      - name: Updating wiki...
        uses: impresscms-dev/phpdocs-wiki-update-action@v2.2.0
        with:
          engine: clean/phpdoc-md
          class_root_namespace: My Project
          include: |
            MyProject\**
```

## Arguments 

This action supports such arguments (used in `with` keyword):

| Argument                 | Required | Default value                                                                                                         | Description                                                                                                                                                             |
|--------------------------|----------|-----------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| wiki_github_update_token | No       | *github_token*                                                                                                        | GitHub token to use for updating project wiki. [This token must have all repo permissions](https://github.com/settings/tokens/new?scopes=repo).                         |
| wiki_github_update_user  | No       | *current_user*                                                                                                        | GitHub username for whom this token belongs                                                                                                                             |
| engine                   | No       | <pre lang="yaml">clean/phpdoc-md</pre>                                                                                                       | What documentation generator should be used? See [engines section](#engines) about possible values                                                                      |
| prefix_lines             | No       | ```##### Notice: Wiki was automatic generated from project sources as project API documentation. Do not edit manually!``` | Lines that will be used to prefix generated wiki content                                                                                                                |
 | setup_php | No | <pre lang="yaml">true</pre>                                                                                                                  | If true, automatically runs commands to setup PHP and install composer dependencies. Set to false, if your package use custom logic or needs some custom PHP extensions | 
 | branches_map | No | <pre lang="yaml">main: master</pre> | At least for now project wiki can't have changed default branch. For such cases is possible to specify branches mapping in YAML format (key is repo branch name and value is wiki branch name) |

Some engines supports or requires extra parameters. See [engines section](#engines) about more info.

## Engines

Update wiki with PHP project documentation action supports multiple engines for generating content. Usually names for engines are same as composer packages that they are using. Different engines can provide different results (f.e. output; some engines can crash with same parameters when others can work).

### `clean/phpdoc-md` [🔗](https://github.com/clean/phpdoc-md)

This engine is default for the action. It needs to specify classes that should be included in generated wiki code, but it works much faster than `evert/phpdoc-md`. Sadly, not for every project right now is possible to use this one.

This engine supports such extra arguments:

| Argument | Required | Default value | Description |
|----------|----------|---------------|-------------|
| class_root_namespace | Yes | | Root class namespace that should be used for documentation |
| include | Yes | | Defines what classes should be included in generated documentation (supports glob style wildcards syntax; each line means one rule) |

### `evert/phpdoc-md` [🔗](https://github.com/evert/phpdoc-md)

This engine first generates an XML data tree with the help of PHPDocumentator and then it is converted to MarkDown format, which is then uploaded to a project wiki. That's why is much slower than `clean/phpdoc-md` but generates much better results.

This engine supports such extra arguments:

| Argument      | Required | Default value | Description                                                                       |
|---------------|----------|---------------|-----------------------------------------------------------------------------------|
| ignored_files | No       |               | Defines files that can be ignored (supports glob rules; each line means one rule) |

## How to contribute? 

If you want to add some functionality or fix bugs, you can fork, change and create pull request. If you not sure how this works, try [interactive GitHub tutorial](https://skills.github.com).

If you found any bug or have some questions, use [issues tab](https://github.com/impresscms-dev/phpdocs-wiki-update-action/issues) and write there your questions.
