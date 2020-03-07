import ActionInterface from '../ActionInterface'
import {debug} from '@actions/core'
import GitInfo from '../handlers/GitInfo'
import TempPaths from '../handlers/TempPaths'
import Execution from '../handlers/Execution'

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
    Execution.run('git', ['add', '-u', ':/'], cwd)
    Execution.run('git', ['add', '.'], cwd)
    try {
      Execution.run(
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
