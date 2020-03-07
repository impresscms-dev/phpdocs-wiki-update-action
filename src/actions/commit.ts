import ActionInterface from '../ActionInterface'
import {debug} from '@actions/core'
import {execCommand} from '../helpers'
import GitInfo from '../handlers/GitInfo'
import TempPaths from '../handlers/TempPaths'

export default class CommitAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Committing docs update...'
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
    const cwd = TempPaths.get('new-docs-main')
    execCommand('git', ['add', '-u', ':/'], cwd)
    execCommand('git', ['add', '.'], cwd)
    try {
      execCommand(
        'git',
        [
          'commit',
          '-m',
          `Automatically generated for https://github.com/${GitInfo.getCurrentRepositoryName()}/commit/${GitInfo.getCurrentLastCommitSHA()}`
        ],
        cwd
      )
    } catch (e) {
      debug('Nothing to commit')
    }
  }
}
