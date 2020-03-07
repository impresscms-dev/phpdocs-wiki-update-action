import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import Composer from '../handlers/Composer'

export default class GlobalSetConfigAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string {
    return 'Doing global configuration...'
  }

  /**
   * @inheritDoc
   */
  shouldRun(generator: GeneratorInterface): boolean {
    return Object.keys(generator.getGlobalComposerConfig()).length > 0
  }

  /**
   * @inheritDoc
   */
  exec(generator: GeneratorInterface): void {
    for (const [key, value] of Object.entries(
      generator.getGlobalComposerConfig()
    )) {
      Composer.run(['global', 'config', key, value])
    }
    Composer.run(['global', 'config', '-l'])
  }
}
