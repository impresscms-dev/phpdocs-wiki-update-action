import ActionInterface from '../ActionInterface'
import {getInput} from '@actions/core'
import GeneratorInterface from '../GeneratorInterface'
import GitInfo from '../GitInfo'
import {execCommand} from '../helpers'

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
  exec(generator: GeneratorInterface, info: GitInfo): void {
    const cwd = getInput('temp_docs_folder')
    try {
      execCommand('git', ['push', '-u', 'origin', info.branchOrTagName], cwd)
    } catch (e) {
      execCommand('git', ['pull'], cwd)
      execCommand('git', ['push', '.', info.branchOrTagName], cwd)
    }
  }
}
