import ActionInterface from '../ActionInterface'
import TempPaths from '../handlers/TempPaths'
import Execution from '../handlers/Execution'

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
    Execution.run(
      'cp',
      ['-r', oldDocs.concat('/.git'), newDocs.concat('/.git')],
      process.cwd()
    )
  }
}
