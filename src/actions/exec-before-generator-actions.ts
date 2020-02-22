import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import GitInfo from '../GitInfo'

export default class ExecBeforeGeneratorActionsAction
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
    return generator.getBeforeActions(info).length > 0
  }

  /**
   * @inheritDoc
   */
  exec(generator: GeneratorInterface, info: GitInfo): void {
    for (const definition of generator.getBeforeActions(info)) {
      definition.exec(info)
    }
  }
}
