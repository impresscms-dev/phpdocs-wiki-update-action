import ActionInterface from '../ActionInterface'
import {getInput} from '@actions/core'
import fs = require('fs-extra')

export default class CopyOldGitDataToNewPlaceAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Updating docs folder...'
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
    fs.copySync(oldDocs.concat('/.git'), newDocs.concat('/.git'), {
      preserveTimestamps: true
    })
  }
}
