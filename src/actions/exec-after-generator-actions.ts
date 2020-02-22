import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import GitInfo from '../GitInfo'

export default class ExecAfterGeneratorActionsAction
  implements ActionInterface {
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
    return generator.getAfterActions(info).length > 0
  }

  /**
   * @inheritDoc
   */
  exec(generator: GeneratorInterface, info: GitInfo): void {
    for (const definition of generator.getAfterActions(info)) {
      definition.exec(info)
    }
  }
}
