import GeneratorInterface from '../GeneratorInterface'
import {composer, composerWithReturn, execCommand} from '../helpers'
import GeneratorActionStepDefinition from '../GeneratorActionStepDefinition'
import {getInput} from '@actions/core'
import {mkdirSync} from 'fs'
import {join} from 'path'

export default class implements GeneratorInterface {
  /**
   * @inheritDoc
   */
  getGlobalComposerRequirements(): {[key: string]: string} {
    return {
      'phpdocumentor/phpdocumentor': '2.9.*',
      'symfony/process': '~2.0'
    }
  }

  /**
   * @inheritDoc
   */
  getComposerRequirements(): {[key: string]: string} {
    return {'evert/phpdoc-md': '~0.2.0'}
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
        'Deleting XML data...',
        this.deleteFolder,
        getInput('temp_docs_folder').concat('.xml')
      ),
      new GeneratorActionStepDefinition(
        null,
        'Deleting Cache data...',
        this.deleteFolder,
        getInput('temp_docs_folder').concat('.cache')
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
        getInput('temp_docs_folder').concat('.xml'),
        getInput('temp_docs_folder').concat('.cache')
      ),
      new GeneratorActionStepDefinition(
        this,
        'Install dev requirements...',
        this.installDevRequirements
      ),
      new GeneratorActionStepDefinition(
        null,
        'Creating docs folder...',
        mkdirSync,
        getInput('temp_docs_folder')
      )
    ]
  }

  /**
   * @inheritDoc
   */
  generate(): void {
    composer([
      'exec',
      'phpdocmd',
      getInput('temp_docs_folder').concat('.xml/structure.xml'),
      getInput('temp_docs_folder'),
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
    const path = this.getGlobalComposerPath()
    let cmd = join(
      path,
      'vendor',
      'bin',
      'phpdoc'
    ).replace(/\\/g, '/')
    if (
      process.platform.toString() === 'win32' ||
      process.platform.toString() === 'win64'
    ) {
      cmd = cmd.concat('.bat')
    }
    execCommand(
      cmd,
      [
        '--cache-folder',
        cachePath,
        '-d',
        process.cwd().replace(/\\/g, '/'),
        '-t',
        dstPath,
        '--template=xml',
        '-v',
        '--ansi',
        '--no-interaction'
      ],
      process.cwd()
    )
  }

  /**
   * Gets global composer path
   */
  private getGlobalComposerPath(): string {
    return composerWithReturn(['config', '-g', 'home']).trim()
  }

  /**
   * Removes data folder
   *
   * @param string pathToDelete Path to delete
   */
  private deleteFolder(pathToDelete: string): void {
    execCommand('rm', ['-rf', pathToDelete], process.cwd())
  }

  /**
   * Remove dev requirements
   */
  private removeDevRequirements(): void {
    composer(['install', '--no-dev'])
  }

  /**
   * Installing dev requirements
   */
  private installDevRequirements(): void {
    composer(['install'])
  }
}
