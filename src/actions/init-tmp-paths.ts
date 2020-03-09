import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import TempPaths from '../handlers/TempPaths'
import {getInput} from '@actions/core'

export default class InitTempPathsAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Configuring temporal paths...'
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
  exec(generator: GeneratorInterface): void {
    const places = generator
      .getNeededTemporalPathPlaces()
      .concat([
        'new-docs-main',
        'composer-global-backup',
        'composer-local-backup'
      ])
      .filter((value, index, self) => {
        return self.indexOf(value) === index
      })
    for (const place of places) {
      TempPaths.add(place, true)
    }
    TempPaths.add('old-docs-main', false)
    TempPaths.addSubpathAlias(
      'old-docs-workdir',
      'old-docs-main',
      getInput('workdir', {required: false})
    )
    TempPaths.addSubpathAlias(
      'new-docs-workdir',
      'new-docs-main',
      getInput('workdir', {required: false})
    )
    TempPaths.debug()
  }
}
