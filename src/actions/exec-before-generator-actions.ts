import ActionInterface from '../ActionInterface'
import {getInput} from '@actions/core'
import GeneratorInterface from '../GeneratorInterface'
import GitInfo from '../GitInfo'

export default class implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return null
  }

  /**
   * @inheritDoc
   */
  shouldRun(generator: GeneratorInterface, info: GitInfo): boolean {
    return generator.getBeforeActions(getInput, info).length > 0
  }

  /**
   * @inheritDoc
   */
  exec(generator: GeneratorInterface, info: GitInfo): void {
    for (const definition of generator.getBeforeActions(getInput, info)) {
      definition.exec(info);
    }
  }
}
