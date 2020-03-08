import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import {copyFileSync, existsSync} from 'fs'
import {basename, join} from 'path'
import TempPaths from '../handlers/TempPaths'
import Composer from '../handlers/Composer'

export default class BackupComposerFilesAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string {
    return 'Backuping Composer files...'
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
    this.backupFile('composer.lock', 'composer-local-backup')
    this.backupFile(join(globalPath, 'composer.lock'), 'composer-global-backup')
    this.backupFile('composer.json', 'composer-local-backup')
    this.backupFile(join(globalPath, 'composer.json'), 'composer-global-backup')
    this.backupFile(join(globalPath, 'config.json'), 'composer-global-backup')
  }

  /**
   * Backups file
   *
   * @param string file File to backup
   * @param string dstType Destination temp path type
   */
  protected backupFile(file: string, dstType: string): void {
    if (!existsSync(file)) {
      return
    }
    const fileName = basename(file)
    copyFileSync(file, TempPaths.getFilename(dstType, fileName))
  }
}
