import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import {existsSync, renameSync, unlinkSync} from 'fs'
import {getGlobalComposerPath} from '../helpers'
import {basename, dirname} from 'path'

export default class RestoreComposerFiles implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string {
    return 'Restoring backuped Composer files...'
  }

  /**
   * @inheritDoc
   */
  shouldRun(generator: GeneratorInterface): boolean {
    return (
      Object.keys(generator.getGlobalComposerRequirements()).length > 0 ||
      Object.keys(generator.getComposerRequirements()).length > 0
    )
  }

  /**
   * @inheritDoc
   */
  exec(): void {
    const globalPath = getGlobalComposerPath()
    const files = [
      'composer.lock',
      'composer.json',
      globalPath.concat('/composer.lock'),
      globalPath.concat('/composer.json'),
      globalPath.concat('/config.json')
    ]
    for (const file of files) {
      if (existsSync(file)) {
        unlinkSync(file)
      }
      const fileName = basename(file)
      const path = dirname(file)
      const bkpFilename = path.concat('/.', fileName, '.bkp')
      if (existsSync(bkpFilename)) {
        renameSync(bkpFilename, file)
      }
    }
  }
}
