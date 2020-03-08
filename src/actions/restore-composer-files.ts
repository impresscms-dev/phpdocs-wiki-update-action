import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import {existsSync, renameSync, unlinkSync} from 'fs'
import {join} from 'path'
import TempPaths from '../handlers/TempPaths'
import Composer from '../handlers/Composer'

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
    const globalPath = Composer.getGlobalPath()
    this.restoreFile('composer.lock', 'composer-local-backup', process.cwd())
    this.restoreFile('composer.json', 'composer-local-backup', process.cwd())
    this.restoreFile('composer.lock', 'composer-global-backup', globalPath)
    this.restoreFile('composer.json', 'composer-global-backup', globalPath)
    this.restoreFile('config.json', 'composer-global-backup', globalPath)
  }

  /**
   * Restores backup file
   *
   * @param string shortFilename File to restore
   * @param string srcType Source temp path type
   * @param string dstPath Where to restore
   */
  protected restoreFile(
    shortFilename: string,
    srcType: string,
    dstPath: string
  ): void {
    const bkpFilename = TempPaths.getFilename(srcType, shortFilename)
    if (!existsSync(bkpFilename)) {
      return
    }
    const dstFile = join(dstPath, shortFilename)
    if (existsSync(dstFile)) {
      unlinkSync(dstFile)
    }
    renameSync(bkpFilename, dstFile)
  }
}
