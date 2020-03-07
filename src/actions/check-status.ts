import ActionInterface from '../ActionInterface'
import {execCommand} from '../helpers'
import TempPaths from '../handlers/TempPaths'

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
    execCommand('git', ['status'], TempPaths.get('new-docs-main'))
  }
}
