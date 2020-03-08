import ActionInterface from '../ActionInterface'
import {debug} from '@actions/core'
import {readFileSync, renameSync, writeFileSync} from 'fs'
import {basename, dirname, extname} from 'path'
import TempPaths from '../handlers/TempPaths'
import Execution from '../handlers/Execution'
import readDirSync = require('recursive-readdir-sync')

export default class FlattenFileStructureAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Flattering file structure...'
  }

  /**
   * @inheritDoc
   */
  shouldRun(): boolean {
    return true
  }

  /**
   * @inheritDoc
   */
  exec(): void {
    const newDocs = TempPaths.get('new-docs-workdir')
    const filenames = this.generateNewStructData(newDocs)
    const flippedFilenames = this.flipKeysWithValues(filenames)
    for (const newFilename in filenames) {
      const oldFilename = filenames[newFilename]
      if (oldFilename !== newFilename) {
        this.renameFile(newDocs, oldFilename, newFilename)
      }
    }
    for (const newFilename in filenames) {
      this.fixesToNewStyleLinks(
        newDocs.concat('/', newFilename),
        flippedFilenames
      )
    }
  }

  /**
   * Generate filenames data for new files structure
   *
   * @param string cwd Docs path
   */
  generateNewStructData(cwd: string): {[x: string]: string} {
    const newStructData: {[x: string]: string} = {}
    const files = this.getAllFilesInfo(cwd)
    for (const fileInfo of this.filterFileInfoByShortPath(files, false)) {
      newStructData[fileInfo.filename] = fileInfo.filename
    }

    for (const fileInfo of this.filterFileInfoByShortPath(files, true)) {
      let oldFilePath = fileInfo.shortPath.concat('/', fileInfo.filename)
      if (Execution.isRunningOnWindows()) {
        oldFilePath = oldFilePath.replace(/\\/g, '/')
      }
      if (oldFilePath.substr(0, 1) === '/') {
        oldFilePath = oldFilePath.substr(1)
      }
      if (typeof newStructData[fileInfo.filename] == 'undefined') {
        newStructData[fileInfo.filename] = oldFilePath
      } else {
        newStructData[this.generateAltFilename(fileInfo)] = oldFilePath
      }
    }
    return newStructData
  }

  /**
   * Fixes links to new style
   *
   * @param string filename Filename where to fix links
   * @param object filenames Filenames data to fix
   */
  protected fixesToNewStyleLinks(
    filename: string,
    filenames: {[x: string]: string}
  ): void {
    debug(` Fixing ${filename}...`)
    debug('Old content:')
    Execution.run('cat', [filename], process.cwd())
    const content = readFileSync(filename, 'utf8')
    const allPossibleFilenames: {[x: string]: string} = {}
    for (const oldFilename in filenames) {
      const currentFilename = filenames[oldFilename]
      allPossibleFilenames[oldFilename] = currentFilename
      const linFilename = oldFilename.replace(/\\/g, '/')
      allPossibleFilenames[linFilename] = currentFilename
      if (extname(oldFilename) === '.md') {
        allPossibleFilenames[
          oldFilename.substr(0, oldFilename.length - 3)
        ] = currentFilename
      }
      if (extname(linFilename) === '.md') {
        allPossibleFilenames[
          linFilename.substr(0, linFilename.length - 3)
        ] = currentFilename
      }
      const winFilename = oldFilename.replace(/\//g, '\\')
      allPossibleFilenames[winFilename] = currentFilename
      if (extname(winFilename) === '.md') {
        allPossibleFilenames[
          winFilename.substr(0, winFilename.length - 3)
        ] = currentFilename
      }
    }
    const newContent = content.replace(
      /\[([^\]]+)]\(([^\)]+)\)/gm,
      (fullMsg: string, name: string, link: string) => {
        if (typeof allPossibleFilenames[link] !== 'undefined') {
          const jstr = allPossibleFilenames[link]
            .split('.')
            .slice(0, -1)
            .join('.')
          return `[${name}](${jstr})`
        }
        return fullMsg
      }
    )
    if (newContent !== content) {
      debug('  Changed.')
      writeFileSync(filename, newContent)
      debug('New content:')
      Execution.run('cat', [filename], process.cwd())
    }
  }

  /**
   * Flip keys with values for object
   *
   * @param object obj Object to flip
   */
  protected flipKeysWithValues(obj: {
    [x: string]: string
  }): {[x: string]: string} {
    const ret: {[x: string]: string} = {}
    for (const x in obj) {
      ret[obj[x]] = x
    }
    return ret
  }

  /**
   * Gets all files info in path
   *
   * @param string cwd Path where to get files info
   */
  private getAllFilesInfo(
    cwd: string
  ): {filename: string; shortPath: string}[] {
    return readDirSync(cwd).map((file: string) => {
      const shortFilename = basename(file)
      const pathWithoutFilename = dirname(file)
      const pathPrefix = pathWithoutFilename.substr(cwd.length)
      return {
        filename: shortFilename,
        shortPath: pathPrefix
      }
    })
  }

  /**
   * Renames file
   *
   * @param string newDocs New docs
   * @param string oldFilename Old filename
   * @param string newFilename New filename
   */
  protected renameFile(
    newDocs: string,
    oldFilename: string,
    newFilename: string
  ): void {
    debug(` Renaming ${oldFilename} -> ${newFilename}...`)
    renameSync(
      newDocs.concat('/', oldFilename),
      newDocs.concat('/', newFilename)
    )
  }

  /**
   * Filters file infos by short path
   *
   * @param object[] files Files to filter
   * @param boolean withShortPath Should have anything in short path
   */
  private filterFileInfoByShortPath(
    files: {filename: string; shortPath: string}[],
    withShortPath: boolean
  ): {filename: string; shortPath: string}[] {
    return files.filter((fileInfo: {filename: string; shortPath: string}) => {
      return withShortPath
        ? fileInfo.shortPath !== ''
        : fileInfo.shortPath === ''
    })
  }

  /**
   * Generates alternative filename
   *
   * @param object fileInfo Fileinfo from where to generate new filename
   */
  private generateAltFilename(fileInfo: {
    filename: string
    shortPath: string
  }): string {
    const filenameWithoutExt = fileInfo.filename
      .split('.')
      .slice(0, -1)
      .join('.')
    const ext = extname(fileInfo.filename)
    let namespaceName = fileInfo.shortPath.replace(/\//g, '⁄')
    if (namespaceName.substr(0, 1) === '⁄') {
      namespaceName = namespaceName.substr(1)
    }
    return `${filenameWithoutExt} (${namespaceName})${ext}`
  }
}
