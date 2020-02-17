import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import GitInfo from '../GitInfo'

export default class implements ActionInterface {
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
  exec(generator: GeneratorInterface, info: GitInfo): void {
    generator.generate(info)
  }
}
