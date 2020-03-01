import ActionInterface from '../ActionInterface'
import {getInput} from '@actions/core'
import {execCommand} from '../helpers'

export default class RemoveNotRequiredFilesAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Removing not required files...'
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
    const newDocs = getInput('temp_docs_folder')
    const oldDocs = newDocs.concat('.old')
    execCommand('rm', ['-rf', newDocs, oldDocs, '.phpdoc-md'], process.cwd())
  }
}
