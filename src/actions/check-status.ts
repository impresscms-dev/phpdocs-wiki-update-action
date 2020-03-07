import ActionInterface from '../ActionInterface'
import TempPaths from '../handlers/TempPaths'
import Execution from '../handlers/Execution'

export default class CheckStatusAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Configure git changes status...'
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
    Execution.run('git', ['status'], TempPaths.get('new-docs-main'))
  }
}
