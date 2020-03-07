import ActionInterface from '../ActionInterface'
import {execCommand} from '../helpers'
import GitInfo from '../handlers/GitInfo'
import TempPaths from '../handlers/TempPaths'

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
      execCommand('git', ['push', '-u', 'origin', GitInfo.branchOrTagName], cwd)
    } catch (e) {
      execCommand('git', ['pull'], cwd)
      execCommand('git', ['push', '.', GitInfo.branchOrTagName], cwd)
    }
  }
}
