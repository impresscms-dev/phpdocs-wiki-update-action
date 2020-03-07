import ActionInterface from '../ActionInterface'
import GitInfo from '../handlers/GitInfo'
import TempPaths from '../handlers/TempPaths'
import Execution from '../handlers/Execution'

export default class PushUpdateAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Pushing docs update...'
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
    try {
      Execution.run(
        'git',
        ['push', '-u', 'origin', GitInfo.branchOrTagName],
        cwd
      )
    } catch (e) {
      Execution.run('git', ['pull'], cwd)
      Execution.run('git', ['push', '.', GitInfo.branchOrTagName], cwd)
    }
  }
}
