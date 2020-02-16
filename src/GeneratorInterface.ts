import {InputOptions} from '@actions/core'
import GitInfo from './GitInfo'
import GeneratorActionStepDefinition from './GeneratorActionStepDefinition'

export default interface GeneratorInterface {
  /**
   * If some composer packages are needed gets list names for installation
   */
  getComposerRequirements(): string[]

  /**
   * Executes this action before generating documentation
   *
   * @param callback getInput Get input argument
   * @param GitInfo info Main branch git info
   */
  getBeforeActions(
    getInput: (name: string, options?: InputOptions) => string,
    info: GitInfo
  ): GeneratorActionStepDefinition[]

  /**
   * Generate documentation
   *
   * @param callback getInput Get input argument
   * @param GitInfo info Main branch git info
   */
  generate(
    getInput: (name: string, options?: InputOptions) => string,
    info: GitInfo
  ): void

  /**
   * Executes this action after generation
   *
   * @param callback getInput Get input argument
   * @param GitInfo info Main branch git info
   */
  getAfterActions(
    getInput: (name: string, options?: InputOptions) => string,
    info: GitInfo
  ): GeneratorActionStepDefinition[]

  /**
   * Checks if all required input options are defined for generator
   *
   * @param callback getInput Get input argument
   *
   * @return boolean
   */
  checkIfAllInputOptionsDefined(
    getInput: (name: string, options?: InputOptions) => string
  ): boolean
}
