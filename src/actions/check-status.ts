import ActionInterface from '../ActionInterface'
import {getInput} from '@actions/core'
import GeneratorInterface from '../GeneratorInterface'
import GitInfo from '../GitInfo'
import execCommand from '../helpers/execCommand'

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
  shouldRun(generator: GeneratorInterface, info: GitInfo): boolean {
    return true
  }

  /**
   * @inheritDoc
   */
  exec(generator: GeneratorInterface, info: GitInfo): void {
    const cwd = getInput('temp_docs_folder')
    execCommand('git', ['status'], cwd)
  }
}
