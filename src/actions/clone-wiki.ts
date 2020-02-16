import ActionInterface from '../ActionInterface'
import {spawnSync} from 'child_process'
import {debug, info, getInput} from '@actions/core'
import {existsSync, mkdirSync} from 'fs'
import execCommand from '../helpers/execCommand'
import GitInfo from '../GitInfo'
import GeneratorInterface from '../GeneratorInterface'

export default class implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string {
    return 'Cloning old wiki...'
  }

  /**
   * @inheritDoc
   */
  shouldRun(generator: GeneratorInterface, info: GitInfo): boolean {
    return true
  }

  /**
   * @inheritDoc
   */
  exec(generator: GeneratorInterface, gitInfo: GitInfo): void {
    info('Cloning old wiki...')
    let oldDocsDir = this.getOldDocsPath()
    if (existsSync(oldDocsDir)) {
      throw new Error(oldDocsDir + " already exists but shouldn't")
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
   * Checks if branch already exist on dir
   *
   * @param string branch Branch to check
   * @param string cwd Dir where to check
   */
  protected branchExist(branch: string, cwd: string): boolean {
    return (
      spawnSync('git', ['branch', '--list', branch], {
        cwd
      })
        .output.toString()
        .trim() == branch
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
    return getInput('temp_docs_folder') + '.old'
  }
}
