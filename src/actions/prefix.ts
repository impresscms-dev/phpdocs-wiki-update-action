import {EOL} from 'os'
import ActionInterface from '../ActionInterface'
import {debug, getInput} from '@actions/core'
import {readFileSync, writeFileSync} from 'fs'
import {execCommand} from '../helpers'
import readDirSync = require('recursive-readdir-sync')

export default class PrefixAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Prefixing file lines...'
  }

  /**
   * @inheritDoc
   */
  shouldRun(): boolean {
    return this.getPrefixLines().length > 0
  }

  /**
   * @inheritDoc
   */
  exec(): void {
    const newDocs = getInput('temp_docs_folder')
    const prefix = this.getPrefixLines()
    for (const file of readDirSync(newDocs)) {
      debug(' '.concat(file.toString()))
      const content = readFileSync(file.toString(), 'utf8')
      const newContent = prefix.concat(
        content
          .split(/\n/g)
          .map(line => line.trimRight())
          .join(EOL)
      )
      debug('Old content:')
      execCommand('cat', [file.toString()], process.cwd())
      debug('New content:')
      writeFileSync(file.toString(), newContent)
      execCommand('cat', [file.toString()], process.cwd())
      throw new Error('Test')
    }
  }

  /**
   * Gets prefix that should be used for each file
   */
  protected getPrefixLines(): string {
    let lines = getInput('prefix_lines')
    if (typeof lines == 'string' && lines.length > 0) {
      lines = lines.concat(EOL)
    } else {
      lines = ''
    }
    return lines
  }
}
