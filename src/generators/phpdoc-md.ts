import GeneratorInterface from '../GeneratorInterface'
import {InputOptions} from '@actions/core'
import GitInfo from '../GitInfo'
import execCommand from '../helpers/execCommand'
import {spawnSync} from 'child_process'
import {renameSync, writeFileSync} from 'fs'
import {EOL} from 'os'
import GeneratorActionStepDefinition from '../GeneratorActionStepDefinition'

const picomatch = require('picomatch');

export default class PHPDocMDGenerator implements GeneratorInterface {
  /**
   * @inheritDoc
   */
  getComposerRequirements(): Array<string> {
    return ['clean/phpdoc-md']
  }

  /**
   * @inheritDoc
   */
  checkIfAllInputOptionsDefined(
    getInput: (name: string, options?: InputOptions) => string
  ): boolean {
    return (
      getInput('class_root_namespace').length > 0 &&
      getInput('include').length > 0
    )
  }

  /**
   * @inheritDoc
   */
  getAfterActions(
    getInput: (name: string, options?: InputOptions) => string,
    gitInfo: GitInfo
  ): Array<GeneratorActionStepDefinition> {
    return [
      new GeneratorActionStepDefinition(
        null,
        'Renaming README.md to Home.md...',
        renameSync,
        getInput('temp_docs_folder') + '/README.md',
        getInput('temp_docs_folder') + '/HOME.md'
      )
    ]
  }

  /**
   * @inheritDoc
   */
  getBeforeActions(
    getInput: (name: string, options?: InputOptions) => string,
    info: GitInfo
  ): Array<GeneratorActionStepDefinition> {
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
  generate(
    getInput: (name: string, options?: InputOptions) => string,
    info: GitInfo
  ): void {
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
    include: Array<string>,
    tempDocsPath: string
  ) {
      execCommand('composer', ['install', '-a'], cwd);
      let classes = Object.keys(this.readComposerConfig()).filter(key =>
          picomatch.isMatch(key, include)
      );
      let config = {
          rootNamespace,
          destDirectory: tempDocsPath,
          format: 'github',
          classes
      };
      let contents =
          '<?php' +
          EOL +
          'return json_decode(' +
          JSON.stringify(JSON.stringify(config)) +
          ', false);';
    writeFileSync(cwd + '/.phpdoc-md', contents)
  }

  /**
   * Reads autoload classes from composer
   */
  protected readComposerConfig(): object {
    return JSON.parse(
      spawnSync('php', [
        '-r',
        'include_once "../vendor/autoload.php"; echo json_encode(include("./vendor/composer/autoload_classmap.php"));'
      ])
        .output.toString()
        .trim()
    )
  }
}
