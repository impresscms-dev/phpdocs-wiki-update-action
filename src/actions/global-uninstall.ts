import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import {composer} from '../helpers'

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
  exec(generator: GeneratorInterface): void {
    const packages = Object.keys(generator.getGlobalComposerRequirements())
    composer(['global', 'remove', '--dev', '--no-progress'].concat(packages))
  }
}
