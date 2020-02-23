import GeneratorInterface from '../GeneratorInterface'
import {debug, getInput} from '@actions/core'
import {composer, execCommand, execCommandAndReturn} from '../helpers'
import {renameSync, writeFileSync} from 'fs'
import {EOL} from 'os'
import GeneratorActionStepDefinition from '../GeneratorActionStepDefinition'
import picomatch = require('picomatch')

export default class implements GeneratorInterface {
  /**
   * @inheritDoc
   */
  getComposerRequirements(): string[] {
    return ['clean/phpdoc-md']
  }

  /**
   * @inheritDoc
   */
  checkIfAllInputOptionsDefined(): boolean {
    return (
      getInput('class_root_namespace').length > 0 &&
      getInput('include').length > 0
    )
  }

  /**
   * @inheritDoc
   */
  getAfterActions(): GeneratorActionStepDefinition[] {
    return [
      new GeneratorActionStepDefinition(
        null,
        'Renaming README.md to Home.md...',
        renameSync,
        getInput('temp_docs_folder').concat('/README.md'),
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
        'Generating generator config...',
        this.generateConfig,
        process.cwd(),
        getInput('class_root_namespace'),
        getInput('include').split(EOL),
        getInput('temp_docs_folder')
      )
    ]
  }

  /**
   * @inheritDoc
   */
  generate(): void {
    execCommand('./vendor/bin/phpdoc-md', [], process.cwd())
  }

  /**
   * Generates PHPDocMD config
   *
   * @param string cwd
   * @param string rootNamespace Root namespace for documentation
   * @param string include      List of classes to include
   * @param string tempDocsPath Temporally docs folder where new documentation should be generated
   */
  protected generateConfig(
    cwd: string,
    rootNamespace: string,
    include: string[],
    tempDocsPath: string
  ): void {
    composer(['install', '--classmap-authoritative'], cwd)
    const classes = this.readComposerConfig()
      .filter(key => key !== null)
      .filter(key => picomatch.isMatch(key, include))
    if (classes.length === 0) {
      throw new Error('Now classes matches include rules')
    }
    const generated = '<?php'.concat(
      EOL,
      'return [',
      EOL,
      '    "rootNamespace" => ',
      JSON.stringify(rootNamespace),
      ',',
      EOL,
      '    "destDirectory" => ',
      JSON.stringify(tempDocsPath),
      ',',
      EOL,
      '    "format" => "github",',
      EOL,
      '    "classes" => [',
      EOL,
      '                      ',
      classes
        .map(k => JSON.stringify(k))
        .join(','.concat(EOL, '                      ')),
      '],',
      EOL,
      '];'
    )
    debug('Generated config:')
    debug(generated)
    writeFileSync(cwd.concat('/.phpdoc-md'), generated)
  }

  /**
   * Reads autoload classes from composer
   */
  protected readComposerConfig(): string[] {
    return JSON.parse(
      execCommandAndReturn(
        'php',
        [
          '-r',
          'include_once "./vendor/autoload.php"; echo json_encode(array_keys(include("./vendor/composer/autoload_classmap.php")));'
        ],
        process.cwd()
      )
    )
  }
}
