import GeneratorInterface from '../GeneratorInterface'
import GeneratorActionStepDefinition from '../GeneratorActionStepDefinition'
import {getInput} from '@actions/core'
import {renameSync} from 'fs'
import {join} from 'path'
import TempPaths from '../handlers/TempPaths'
import Execution from '../handlers/Execution'
import Composer from '../handlers/Composer'

export default class implements GeneratorInterface {
  /**
   * @inheritDoc
   */
  getNeededTemporalPathPlaces(): string[] {
    return ['xml', 'cache']
  }

  /**
   * @inheritDoc
   */
  getComposerConfig(): {[key: string]: string} {
    return {}
  }

  /**
   * @inheritDoc
   */
  getGlobalComposerConfig(): {[key: string]: string} {
    return {
      'minimum-stability': 'dev',
      'prefer-stable': 'true'
    }
  }

  /**
   * @inheritDoc
   */
  getComposerRequirements(): {[key: string]: string} {
    return {}
  }

  /**
   * @inheritDoc
   */
  checkIfAllInputOptionsDefined(): boolean {
    return true
  }

  /**
   * @inheritDoc
   */
  getAfterActions(): GeneratorActionStepDefinition[] {
    return [
      new GeneratorActionStepDefinition(
        null,
        'Renaming ApiIndex.md to Home.md...',
        renameSync,
        TempPaths.getFilename('new-docs-workdir', 'ApiIndex.md'),
        TempPaths.getFilename('new-docs-workdir', 'HOME.md')
      )
    ]
  }

  /**
   * @inheritDoc
   */
  getBeforeActions(): GeneratorActionStepDefinition[] {
    return []
  }

  /**
   * @inheritDoc
   */
  generate(): void {
    // TODO: Change here
    Composer.run([
      'global',
      'exec',
      'phpdocmd',
      Execution.replaceWinPathCharToUnix(
        TempPaths.getFilename('xml', 'structure.xml')
      ),
      Execution.replaceWinPathCharToUnix(TempPaths.get('new-docs-workdir')),
      '-v'
    ])
  }

  /**
   * Generates XML Data
   *
   * @param string dstPath Where to place result?
   * @param string cachePath Cache path
   */
  private generateXML(dstPath: string, cachePath: string): void
  {
    const path = Composer.getGlobalPath()
    const cmd = Execution.replaceWinPathCharToUnix(
      Execution.suffixExtIfRunningOnWindows(
        join(path, 'vendor', 'bin', 'phpdoc')
      )
    )
    const args = [
      '--cache-folder',
      Execution.replaceWinPathCharToUnix(cachePath),
      '-d',
      Execution.replaceWinPathCharToUnix(process.cwd()),
      '-t',
      Execution.replaceWinPathCharToUnix(dstPath),
      '--template=xml',
      '-v',
      '--ansi',
      '--no-interaction',
      '--extensions=php'
    ].concat(
      getInput('ignored_files', {required: false})
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.length > 0)
        .map(line => `--ignore=${line}`)
    )
    Execution.run(cmd, args, process.cwd(), {APP_ENV: 'dev'})
  }
}
