import GeneratorInterface from '../GeneratorInterface'
import {debug, getInput} from '@actions/core'
import {renameSync, unlinkSync, writeFileSync} from 'fs'
import {EOL} from 'os'
import GeneratorActionStepDefinition from '../GeneratorActionStepDefinition'
import TempPaths from '../handlers/TempPaths'
import Execution from '../handlers/Execution'
import Composer from '../handlers/Composer'

import picomatch = require('picomatch')

export default class implements GeneratorInterface {
  /**
   * @inheritDoc
   */
  getNeededTemporalPathPlaces(): string[] {
    return []
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
    return {}
  }

  /**
   * @inheritDoc
   */
  getGlobalComposerRequirements(): {[key: string]: string} {
    return {}
  }

  /**
   * @inheritDoc
   */
  getComposerRequirements(): {[key: string]: string} {
    return {'clean/phpdoc-md': '*'}
  }

  /**
   * @inheritDoc
   */
  checkIfAllInputOptionsDefined(): boolean {
    return (
      getInput('class_root_namespace', {required: true}).length > 0 &&
      getInput('include', {required: true}).length > 0
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
        TempPaths.getFilename('new-docs-workdir', 'README.md'),
        TempPaths.getFilename('new-docs-workdir', 'HOME.md')
      ),
      new GeneratorActionStepDefinition(
        null,
        'Deleting config...',
        unlinkSync,
        TempPaths.getFilename('new-docs-workdir', '.phpdoc-md')
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
        getInput('class_root_namespace', {required: true}),
        getInput('include', {required: true})
          .replace(/\n/g, EOL)
          .split(EOL)
          .map(x => x.trim())
          .filter(x => x.length > 0),
        TempPaths.get('new-docs-workdir')
      )
    ]
  }

  /**
   * @inheritDoc
   */
  generate(): void {
    Composer.run(['exec', 'phpdoc-md', '-v'])
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
    Composer.run(
      [
        'install',
        '--classmap-authoritative',
        '--no-progress',
        '--no-suggest',
        '-o',
        '--no-cache',
        '--no-scripts'
      ],
      cwd
    )
    let changedIncludeRules = include.map(key => key.replace(/\\/g, '/'))
    const badChangedIncludeRules = changedIncludeRules
      .filter(rule => rule.startsWith('!'))
      .map(rule => rule.substring(1))
    changedIncludeRules = changedIncludeRules.filter(
      rule => !badChangedIncludeRules.includes(rule.substring(1))
    )
    const classes = this.readComposerConfig()
      .filter(key => key !== null)
      .map(key => key.replace(/\\/g, '/'))
      .filter(key => picomatch.isMatch(key, changedIncludeRules))
      .filter(key => !picomatch.isMatch(key, badChangedIncludeRules))
      .map(key => key.replace(/\//g, '\\'))
    debug('Include rules:')
    if (changedIncludeRules.length > 0) {
      for (const rule of changedIncludeRules) {
        debug('  [*] '.concat(rule).replace(/\//g, '\\'))
      }
    } else {
      debug('  (none)')
    }
    debug('Do not include rules:')
    if (badChangedIncludeRules.length > 0) {
      for (const rule of badChangedIncludeRules) {
        debug('  [*] '.concat(rule).replace(/\//g, '\\'))
      }
    } else {
      debug('  (none)')
    }
    if (classes.length === 0) {
      throw new Error('No classes matches include rules')
    }
    const generated = '<?php'.concat(
      EOL,
      'return (object)[',
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
      '        ',
      classes.map(k => JSON.stringify(k)).join(','.concat(EOL, '        ')),
      EOL,
      '    ],',
      EOL,
      '];'
    )
    debug('Generated config:')
    for (const line of generated.split('\n')) {
      debug(line.replace(/~+$/g, '').replace(/\r/g, ''))
    }
    writeFileSync(cwd.concat('/.phpdoc-md'), generated)
  }

  /**
   * Reads autoload classes from composer
   */
  protected readComposerConfig(): string[] {
    return JSON.parse(
      Execution.getResults(
        'php',
        [
          '-d',
          'display_errors=0',
          '-d',
          'error_reporting=0',
          '-r',
          'require "./vendor/autoload.php"; echo json_encode(array_keys(require("./vendor/composer/autoload_classmap.php")));'
        ],
        process.cwd()
      )
    )
  }
}
