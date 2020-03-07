import ActionInterface from '../ActionInterface'
import {execCommand, replaceWinPathCharToUnix} from '../helpers'
import TempPaths from '../handlers/TempPaths'

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
    execCommand(
      'rm',
      ['-rf'].concat(
        TempPaths.getAllPaths().map(path => replaceWinPathCharToUnix(path))
      ),
      process.cwd()
    )
  }
}
