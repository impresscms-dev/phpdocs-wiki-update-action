import ActionInterface from '../ActionInterface'
import {execCommand} from '../helpers'
import TempPaths from '../handlers/TempPaths'

export default class CopyOldGitDataToNewPlaceAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Updating docs folder...'
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
    const newDocs = TempPaths.get('new-docs-main')
    const oldDocs = TempPaths.get('old-docs-main')
    execCommand(
      'cp',
      ['-r', oldDocs.concat('/.git'), newDocs.concat('/.git')],
      process.cwd()
    )
  }
}
