import ActionInterface from '../ActionInterface'
import {getInput} from '@actions/core'
import {existsSync, mkdirSync} from 'fs'
import {execCommand} from '../helpers'
import GitInfo from '../GitInfo'
import GeneratorInterface from '../GeneratorInterface'
import {basename, dirname} from 'path'

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
    execCommand(
      'git',
      [
        'clone',
        `https://${this.getUpdateUser()}:${this.getUpdateToken()}@github.com/${gitInfo.getCurrentRepositoryName()}.wiki.git`,
        basename(oldDocsDir)
      ],
      dirname(oldDocsDir)
    )
    execCommand('git', ['config', '--local', 'gc.auto', '0'], oldDocsDir)
    execCommand(
      'git',
      ['checkout', '-B', gitInfo.branchOrTagName, '--track'],
      oldDocsDir
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
