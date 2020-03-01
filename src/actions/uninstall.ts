import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import {composer} from '../helpers'
import {existsSync, renameSync, unlinkSync} from 'fs'

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
    unlinkSync('composer.lock')
    unlinkSync('composer.json')
    if (existsSync('.composer.lock.bkp')) {
      renameSync('.composer.lock.bkp', 'composer.lock')
    }
    renameSync('.composer.json.bkp', 'composer.json')
    composer(['install', '--no-progress', '--no-suggest'])
  }
}
