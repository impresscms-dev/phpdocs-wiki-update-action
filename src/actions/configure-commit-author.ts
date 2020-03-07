import ActionInterface from '../ActionInterface'
import GitInfo from '../handlers/GitInfo'
import TempPaths from '../handlers/TempPaths'
import Execution from '../handlers/Execution'

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
    Execution.run(
      'git',
      ['config', '--local', 'user.email', GitInfo.lastCommitEmail],
      cwd
    )
    Execution.run(
      'git',
      ['config', '--local', 'user.name', GitInfo.lastCommitAuthor],
      cwd
    )
  }
}
