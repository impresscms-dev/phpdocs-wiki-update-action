import ActionInterface from '../ActionInterface'
import {debug, getInput} from '@actions/core'
import GeneratorInterface from '../GeneratorInterface'
import GitInfo from '../GitInfo'
import {readFileSync, writeFileSync} from 'fs'

const readDirSync = require('recursive-readdir-sync')

export default class implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Prefixing file lines...'
  }

  /**
   * @inheritDoc
   */
  shouldRun(generator: GeneratorInterface, info: GitInfo): boolean {
    return this.getPrefixLines().length > 0
  }

  /**
   * @inheritDoc
   */
  exec(generator: GeneratorInterface, info: GitInfo): void {
    const newDocs = getInput('temp_docs_folder')
    const prefix = this.getPrefixLines()
    for (const file of readDirSync(newDocs)) {
      debug(' '.concat(file.toString()))
      writeFileSync(
        file.toString(),
        prefix.concat(readFileSync(file.toString()).toString())
      )
    }
  }

  /**
   * Gets prefix that should be used for each file
   */
  protected getPrefixLines(): string {
    return getInput('prefix_lines')
  }
}
