import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'

export default class GenerateAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Generating documentation...'
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
  exec(generator: GeneratorInterface): void {
    generator.generate()
  }
}
