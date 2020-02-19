import ActionInterface from '../ActionInterface'
import {getInput} from '@actions/core'
import {execCommand} from '../helpers'

export default class implements ActionInterface {
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
    const cwd = getInput('temp_docs_folder')
    execCommand('git', ['status'], cwd)
  }
}
