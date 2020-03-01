import GitInfo from './GitInfo'
import GeneratorActionStepDefinition from './GeneratorActionStepDefinition'

export default interface GeneratorInterface {
  /**
   * If some composer packages are needed gets list names for installation
   */
  getComposerRequirements(): {[key: string]: string}

  /**
   * If some global composer packages are needed gets list names for installation
   */
  getGlobalComposerRequirements(): {[key: string]: string}

  /**
   * Executes this action before generating documentation
   *
   * @param GitInfo info Main branch git info
   */
  getBeforeActions(info: GitInfo): GeneratorActionStepDefinition[]

  /**
   * Generate documentation
   *
   * @param GitInfo info Main branch git info
   */
  generate(info: GitInfo): void

  /**
   * Executes this action after generation
   *
   * @param GitInfo info Main branch git info
   */
  getAfterActions(info: GitInfo): GeneratorActionStepDefinition[]

  /**
   * Checks if all required input options are defined for generator
   *
   * @return boolean
   */
  checkIfAllInputOptionsDefined(): boolean
}
