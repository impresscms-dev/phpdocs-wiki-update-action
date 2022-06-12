import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import Composer from '../handlers/Composer'

export default class GlobalUninstallAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string {
    return 'Uninstalling global required composer packages...'
  }

  /**
   * @inheritDoc
   */
  shouldRun(generator: GeneratorInterface): boolean {
    return Object.keys(generator.getGlobalComposerRequirements()).length > 0
  }

  /**
   * @inheritDoc
   */
  exec(): void {
    Composer.run(
      [
        'global',
        'install',
        '--no-interaction',
        '--no-progress',
        '--no-scripts',
        '--no-plugins',
        '--ansi',
      ]
    )
  }
}
