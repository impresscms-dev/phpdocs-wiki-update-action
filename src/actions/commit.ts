import ActionInterface from '../ActionInterface'
import {debug, getInput} from '@actions/core'
import GeneratorInterface from '../GeneratorInterface'
import GitInfo from '../GitInfo'
import execCommand from '../helpers/execCommand'

export default class implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Committing docs update...'
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
  exec(generator: GeneratorInterface, info: GitInfo): void {
    const cwd = getInput('temp_docs_folder')
    execCommand('git', ['add', '-u', ':/'], cwd)
    execCommand('git', ['add', '.'], cwd)
    try {
      execCommand(
        'git',
        [
          'commit',
          '-m',
          `Automatically generated for https://github.com/${info.getCurrentRepositoryName()}/commit/${info.getCurrentLastCommitSHA()}`
        ],
        cwd
      )
    } catch (e) {
      debug('Nothing to commit')
    }
  }
}
