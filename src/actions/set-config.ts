import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import {composer} from '../helpers'

export default class SetConfigAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string {
    return 'Doing local configuration...'
  }

  /**
   * @inheritDoc
   */
  shouldRun(generator: GeneratorInterface): boolean {
    return Object.keys(generator.getComposerConfig()).length > 0
  }

  /**
   * @inheritDoc
   */
  exec(generator: GeneratorInterface): void {
    for (const [key, value] of Object.entries(generator.getComposerConfig())) {
      composer(['config', key, value])
    }
    composer(['config', '-l'])
  }
}
