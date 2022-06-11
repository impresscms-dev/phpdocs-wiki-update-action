import ActionInterface from '../ActionInterface'
import {getInput} from '@actions/core'
import {existsSync, mkdirSync} from 'fs'
import {basename, dirname} from 'path'
import GitInfo from '../handlers/GitInfo'
import TempPaths from '../handlers/TempPaths'
import Execution from '../handlers/Execution'
import OldDocsDirExistButShouldntError from "../errors/OldDocsDirExistButShouldntError"

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
  exec(): void {
    const oldDocsDir = this.getOldDocsPath()
    if (existsSync(oldDocsDir)) {
      throw new OldDocsDirExistButShouldntError(oldDocsDir)
    }
    mkdirSync(oldDocsDir)
    Execution.run(
      'git',
      [
        'clone',
        `https://${this.getUpdateUser()}:${this.getUpdateToken()}@github.com/${GitInfo.getCurrentRepositoryName()}.wiki.git`,
        basename(oldDocsDir)
      ],
      dirname(oldDocsDir)
    )
    Execution.run('git', ['config', '--local', 'gc.auto', '0'], oldDocsDir)
    Execution.run('git', ['branch', '-r'], oldDocsDir)
    if (this.branchExist(GitInfo.branchOrTagName, oldDocsDir)) {
      Execution.run('git', ['checkout', GitInfo.branchOrTagName], oldDocsDir)
      Execution.run('git', ['pull'], oldDocsDir)
    } else {
      Execution.run(
        'git',
        ['checkout', '-b', GitInfo.branchOrTagName],
        oldDocsDir
      )
    }
  }

  /**
   * Checks if branch exist
   *
   * @param string branch Branch to check
   * @param string oldDocsDir Where to check
   *
   * @return boolean
   */
  private branchExist(branch: string, oldDocsDir: string): boolean {
    try {
      Execution.run('git', ['show-branch', `origin/${branch}`], oldDocsDir)
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Gets GitHub token that will be used for update action
   */
  protected getUpdateToken(): string {
    return getInput('wiki_github_update_token', {required: true})
  }

  /**
   * Get GitHub user for witch token belongs
   */
  protected getUpdateUser(): string {
    return getInput('wiki_github_update_user', {required: true})
  }

  /**
   * Get old docs path
   */
  protected getOldDocsPath(): string {
    return TempPaths.get('old-docs-main')
  }
}
