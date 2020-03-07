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
   */
  getBeforeActions(): GeneratorActionStepDefinition[]

  /**
   * Generate documentation
   */
  generate(): void

  /**
   * Executes this action after generation
   */
  getAfterActions(): GeneratorActionStepDefinition[]

  /**
   * Checks if all required input options are defined for generator
   *
   * @return boolean
   */
  checkIfAllInputOptionsDefined(): boolean

  /**
   * Gets composer config that needed to be applied for this package locally
   *
   * @return object
   */
  getComposerConfig(): {[key: string]: string}

  /**
   * Gets composer config that needed to be applied for this package globally
   *
   * @return object
   */
  getGlobalComposerConfig(): {[key: string]: string}

  /**
   * Gets places names that should be linked with temporal paths
   *
   * @return string[]
   */
  getNeededTemporalPathPlaces(): string[]
}
