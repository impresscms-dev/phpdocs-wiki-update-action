import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import Composer from '../handlers/Composer'

export default class UninstallAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string {
    return 'Uninstalling required composer packages...'
  }

  /**
   * @inheritDoc
   */
  shouldRun(generator: GeneratorInterface): boolean {
    return Object.keys(generator.getComposerRequirements()).length > 0
  }

  /**
   * @inheritDoc
   */
  exec(): void {
    Composer.run([
      'install',
      '--no-progress',
      '--no-interaction',
      '--ignore-platform-reqs',
      '--no-plugins',
      '--no-scripts',
      '--ansi',
    ])
  }
}
