import ActionInterface from '../ActionInterface'
import {execCommand} from '../helpers'
import GitInfo from '../handlers/GitInfo'
import TempPaths from '../handlers/TempPaths'

export default class ConfigureCommitAuthorAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Configure WIKI commit author...'
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
    execCommand(
      'git',
      ['config', '--local', 'user.email', GitInfo.lastCommitEmail],
      cwd
    )
    execCommand(
      'git',
      ['config', '--local', 'user.name', GitInfo.lastCommitAuthor],
      cwd
    )
  }
}
