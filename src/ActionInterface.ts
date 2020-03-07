import GeneratorInterface from './GeneratorInterface'

export default interface ActionInterface {
  /**
   * Executes action
   *
   * @param GeneratorInterface generator linked generator
   */
  exec(generator: GeneratorInterface): void

  /**
   * Gets action description
   */
  getDescription(): string | null

  /**
   * Should this action run?
   *
   * @param GeneratorInterface generator linked generator
   */
  shouldRun(generator: GeneratorInterface): boolean
}
