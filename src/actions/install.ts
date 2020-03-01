import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import {composer} from '../helpers'
import {copyFileSync} from 'fs'

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
    return generator.getComposerRequirements().length > 0
  }

  /**
   * @inheritDoc
   */
  exec(generator: GeneratorInterface): void {
    const packages = generator.getComposerRequirements()
    copyFileSync('composer.lock', '.composer.lock.bkp')
    copyFileSync('composer.json', '.composer.json.bkp')
    composer(
      ['require', '--dev', '--no-progress', '--no-suggest'].concat(packages)
    )
  }
}
