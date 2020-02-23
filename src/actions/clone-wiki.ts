import ActionInterface from '../ActionInterface'
import {getInput} from '@actions/core'
import {existsSync, mkdirSync} from 'fs'
import {execCommand, execCommandAndReturn} from '../helpers'
import GitInfo from '../GitInfo'
import GeneratorInterface from '../GeneratorInterface'

export default class CloneWikiAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string {
    return 'Cloning old wiki...'
  }

  /**
   * @inheritDoc
   */
  shouldRun(): boolean {
    return true
  }

  /**
   * @inheritDoc
   */
  exec(generator: GeneratorInterface, gitInfo: GitInfo): void {
    const oldDocsDir = this.getOldDocsPath()
    if (existsSync(oldDocsDir)) {
      throw new Error(oldDocsDir.concat(" already exists but shouldn't"))
    }
    mkdirSync(oldDocsDir)
    execCommand('git', ['init'], oldDocsDir)
    execCommand(
      'git',
      [
        'remote',
        'add',
        'origin',
        `https://${this.getUpdateUser()}:${this.getUpdateToken()}@github.com/${gitInfo.getCurrentRepositoryName()}.wiki.git`
      ],
      oldDocsDir
    )
    execCommand('git', ['config', '--local', 'gc.auto', '0'], oldDocsDir)
    this.gitFetch(oldDocsDir)
    if (this.branchExist(gitInfo.branchOrTagName, oldDocsDir)) {
      execCommand('git', ['checkout', gitInfo.branchOrTagName], oldDocsDir)
    } else {
      execCommand(
        'git',
        ['checkout', '-b', gitInfo.branchOrTagName],
        oldDocsDir
      )
    }
    execCommand('git', ['reset', '--hard'], oldDocsDir)
  }

  /**
   * Executes git fetch command
   *
   * @param string oldDocsDir Old docs dir
   */
  protected gitFetch(oldDocsDir: string): void {
    try {
      execCommand(
        'git',
        [
          '-c',
          'protocol.version=2',
          'fetch',
          '--no-tags',
          '--prune',
          '--progress',
          '--no-recurse-submodules',
          '--depth=1',
          'origin'
        ],
        oldDocsDir
      )
    } catch (e) {
      execCommand(
        'git',
        [
          'fetch',
          '--no-tags',
          '--prune',
          '--progress',
          '--no-recurse-submodules',
          '--depth=1',
          'origin'
        ],
        oldDocsDir
      )
    }
  }

  /**
   * Checks if branch already exist on dir
   *
   * @param string branch Branch to check
   * @param string cwd Dir where to check
   */
  protected branchExist(branch: string, cwd: string): boolean {
    return (
      execCommandAndReturn('git', ['branch', '--list', branch], cwd).trim() ===
      branch
    )
  }

  /**
   * Gets GitHub token that will be used for update action
   */
  protected getUpdateToken(): string {
    return getInput('wiki_github_update_token')
  }

  /**
   * Get GitHub user for witch token belongs
   */
  protected getUpdateUser(): string {
    return getInput('wiki_github_update_user')
  }

  /**
   * Get old docs path
   */
  protected getOldDocsPath(): string {
    return getInput('temp_docs_folder').concat('.old')
  }
}
