import ActionInterface from '../ActionInterface'
import {debug, getInput} from '@actions/core'
import GeneratorInterface from '../GeneratorInterface'
import GitInfo from '../GitInfo'
import {readFileSync, renameSync, writeFileSync} from 'fs'
import {basename, dirname, extname} from 'path'

const readDirSync = require('recursive-readdir-sync');

export default class implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Flattering file structure...'
  }

  /**
   * @inheritDoc
   */
  shouldRun(generator: GeneratorInterface, info: GitInfo): boolean {
    return true
  }

  /**
   * @inheritDoc
   */
  exec(generator: GeneratorInterface, info: GitInfo): void {
    const newDocs = getInput('temp_docs_folder');
    let filenames = this.generateNewStructData(newDocs);
    let flippedFilenames = this.flipKeysWithValues(filenames);
    for (let newFilename in filenames) {
      let oldFilename = filenames[newFilename];
      if (oldFilename != newFilename) {
        this.renameFile(newDocs, oldFilename, newFilename)
      }
      this.fixesToNewStyleLinks(newDocs + '/' + newFilename, flippedFilenames)
    }
  }

  /**
   * Generate filenames data for new struck
   *
   * @param string cwd Docs path
   */
  generateNewStructData(cwd: string): { [x: string]: string } {
    let newStructData: { [x: string]: string } = {};
    let files = readDirSync(cwd).map((file: any) => {
      let short_filename = basename(file);
      let path_without_filename = dirname(file);
      let path_prefix = path_without_filename.substr(cwd.length);
      return {
        filename: short_filename,
        short_path: path_prefix
      }
    });
    for (const fileInfo of files.filter((fileInfo: { filename: string; short_path: string }) => {
      return fileInfo.short_path == ''
    })) {
      newStructData[fileInfo.filename] = fileInfo.filename
    }

    for (const fileInfo of files.filter((fileInfo: { filename: string; short_path: string }) => {
      return fileInfo.short_path != ''
    })) {
      let oldFilePath = fileInfo.short_path + '/' + fileInfo.filename;
      if (typeof newStructData[fileInfo.filename] != 'undefined') {
        newStructData[fileInfo.filename] = oldFilePath
      } else {
        let filenameWithoutExt = fileInfo.filename
          .split('.')
          .slice(0, -1)
          .join('.');
        let ext = extname(fileInfo.filename);
        let newFilename =
          '"' +
          filenameWithoutExt +
          ' (' +
          fileInfo.short_path.replace('/', '\\') +
          ')' +
          ext +
          '"';
        newStructData[newFilename] = oldFilePath
      }
    }
    return newStructData
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
    debug(` Renaming ${oldFilename} -> ${newFilename}...`);
    renameSync(newDocs + '/' + oldFilename, newDocs + '/' + newFilename)
  }

  /**
   * Fixes links to new style
   *
   * @param string filename Filename where to fix links
   * @param object filenames Filenames data to fix
   */
  protected fixesToNewStyleLinks(
    filename: string,
    filenames: { [x: string]: string }
  ): void {
    debug(` Fixing ${filename}...`);
    let content = readFileSync(filename).toString();
    let newContent = content.replace(
      /\[([^\]]+)\]\(([^\)]+)\)/gm,
      (full_msg: string, link: string, name: string) =>
        '[' +
        filenames[link]
          .split('.')
          .slice(0, -1)
          .join('.') +
        '](' +
        name +
        ')'
    );
    if (newContent != content) {
      debug('  Changed.');
      writeFileSync(filename, newContent)
    }
  }

  /**
   * Flip keys with values for object
   *
   * @param object obj Object to flip
   */
  protected flipKeysWithValues(obj: {
    [x: string]: string
  }): { [x: string]: string } {
    let ret: { [x: string]: string } = {};
    for (let x in obj) {
      ret[obj[x]] = x
    }
    return ret
  }
}
