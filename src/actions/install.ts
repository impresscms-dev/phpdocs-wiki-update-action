import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import Composer from '../handlers/Composer'

export default class InstallAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string {
    return 'Installing required composer packages...'
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
  exec(generator: GeneratorInterface): void {
    const packages = Object.entries(generator.getComposerRequirements()).map(
      ([key, value]) => `${key}=${value}`
    )
    Composer.run(
      ['require', '--no-interaction', '--no-progress'].concat(packages)
    )
    Composer.run(['exec'])
  }
}
