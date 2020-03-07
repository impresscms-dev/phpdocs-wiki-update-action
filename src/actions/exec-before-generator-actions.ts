import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'

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
  shouldRun(generator: GeneratorInterface): boolean {
    return generator.getBeforeActions().length > 0
  }

  /**
   * @inheritDoc
   */
  exec(generator: GeneratorInterface): void {
    for (const definition of generator.getBeforeActions()) {
      definition.exec()
    }
  }
}
