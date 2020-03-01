import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import {composer} from '../helpers'

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
    composer(
      ['global', 'require', '--dev', '--no-progress', '--no-suggest'].concat(
        packages
      )
    )
  }
}
