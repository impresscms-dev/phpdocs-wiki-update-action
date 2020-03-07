import ActionInterface from '../ActionInterface'
import TempPaths from '../handlers/TempPaths'
import Execution from '../handlers/Execution'

export default class RemoveNotRequiredFilesAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Removing not required files...'
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
    Execution.run(
      'rm',
      ['-rf'].concat(
        TempPaths.getAllPaths().map(path =>
          Execution.replaceWinPathCharToUnix(path)
        )
      ),
      process.cwd()
    )
  }
}
