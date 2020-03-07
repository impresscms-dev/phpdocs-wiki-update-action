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
  getGlobalComposerRequirements(): {[key: string]: string} {
    return {
      'phpdocumentor/phpdocumentor': '3.*',
      //'symfony/process': '~2.0',
      'evert/phpdoc-md': '~0.2.0'
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
        TempPaths.get('new-docs-workdir').concat('/ApiIndex.md'),
        TempPaths.get('new-docs-workdir').concat('/HOME.md')
      )
    ]
  }

  /**
   * @inheritDoc
   */
  getBeforeActions(): GeneratorActionStepDefinition[] {
    return [
      new GeneratorActionStepDefinition(
        this,
        'Removing dev requirements...',
        this.removeDevRequirements
      ),
      new GeneratorActionStepDefinition(
        this,
        'Generating XML data...',
        this.generateXML,
        TempPaths.get('xml'),
        TempPaths.get('cache')
      ),
      new GeneratorActionStepDefinition(
        this,
        'Install dev requirements...',
        this.installDevRequirements
      )
    ]
  }

  /**
   * @inheritDoc
   */
  generate(): void {
    Composer.run([
      'global',
      'exec',
      'phpdocmd',
      Execution.replaceWinPathCharToUnix(
        join(TempPaths.get('xml'), 'structure.xml')
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
  private generateXML(dstPath: string, cachePath: string): void {
    const path = Composer.getGlobalPath()
    let cmd = join(path, 'vendor', 'bin', 'phpdoc').replace(/\\/g, '/')
    if (
      process.platform.toString() === 'win32' ||
      process.platform.toString() === 'win64'
    ) {
      cmd = cmd.concat('.bat')
    }
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
      getInput('ignore_files')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.length > 0)
        .map(line => '--ignore='.concat(line))
    )
    Execution.run(cmd, args, process.cwd(), {APP_ENV: 'dev'})
  }

  /**
   * Remove dev requirements
   */
  private removeDevRequirements(): void {
    Composer.run(['install', '--no-dev'])
  }

  /**
   * Installing dev requirements
   */
  private installDevRequirements(): void {
    Composer.run(['install'])
  }
}
