import GeneratorInterface from '../GeneratorInterface'
import {composer, execCommand, getGlobalComposerPath} from '../helpers'
import GeneratorActionStepDefinition from '../GeneratorActionStepDefinition'
import {getInput} from '@actions/core'
import {mkdirSync, renameSync} from 'fs'
import {join} from 'path'

export default class implements GeneratorInterface {
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
        'Deleting XML data...',
        this.deleteFolder,
        getInput('temp_docs_folder').concat('.xml')
      ),
      new GeneratorActionStepDefinition(
        null,
        'Deleting Cache data...',
        this.deleteFolder,
        getInput('temp_docs_folder').concat('.cache')
      ),
      new GeneratorActionStepDefinition(
        null,
        'Renaming ApiIndex.md to Home.md...',
        renameSync,
        getInput('temp_docs_folder').concat('/ApiIndex.md'),
        getInput('temp_docs_folder').concat('/HOME.md')
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
    const basePath = join(process.cwd(), getInput('temp_docs_folder')).replace(
      /\\/g,
      '/'
    )
    composer([
      'global',
      'exec',
      'phpdocmd',
      join(basePath.concat('.xml'), 'structure.xml').replace(/\\/g, '/'),
      basePath,
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
    const path = getGlobalComposerPath()
    let cmd = join(path, 'vendor', 'bin', 'phpdoc').replace(/\\/g, '/')
    if (
      process.platform.toString() === 'win32' ||
      process.platform.toString() === 'win64'
    ) {
      cmd = cmd.concat('.bat')
    }
    const args = [
      '--cache-folder',
      cachePath,
      '-d',
      process.cwd().replace(/\\/g, '/'),
      '-t',
      dstPath,
      '--template=xml',
      '-v',
      '--ansi',
      '--no-interaction',
      '--extensions=php'
    ]
    const ignoreFiles = getInput('ignore_files')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.length > 0)
    if (ignoreFiles.length > 0) {
      args.push('--ignore='.concat(ignoreFiles.join(',')))
    }
    execCommand(cmd, args, process.cwd())
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
