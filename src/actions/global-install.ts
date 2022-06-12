import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import Composer from '../handlers/Composer'

export default class GlobalInstallAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string {
    return 'Installing global required composer packages...'
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
  exec(generator: GeneratorInterface): void {
    const packages = Object.entries(
      generator.getGlobalComposerRequirements()
    ).map(([key, value]) => `${key}=${value}`)
    Composer.run(
      [
        'global',
        'require',
        '--no-progress',
        '--no-interaction',
        '--no-scripts',
        '--no-plugins',
        '--ansi',
      ].concat(
        packages
      )
    )
    Composer.run(['global', 'exec'])
  }
}
