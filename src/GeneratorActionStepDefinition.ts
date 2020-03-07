import {info} from '@actions/core'

/**
 * Class to define generator action step
 */
export default class GeneratorActionStepDefinition {
  /**
   * Description of action
   */
  readonly description: string

  /**
   * Callback for action
   */
  readonly execCallback: Function

  /**
   * Extra arguments for callback
   */
  readonly args: any[]

  /**
   * Linked generator
   */
  readonly generator: object | null

  /**
   * Constructor
   *
   * @param object|null generator Linked generator
   * @param string description Description to print for step
   * @param Function execCallback Callback that will be executed for action
   * @param args any extra args
   */
  constructor(
    generator: object | null,
    description: string,
    execCallback: Function,
    ...args: (
      | number
      | string
      | boolean
      | Function
      | null
      | number[]
      | string[]
      | boolean[]
      | Function[]
      | null[]
    )[]
  ) {
    this.description = description
    this.execCallback = execCallback
    this.args = args
    this.generator = generator
  }

  /**
   * Executes action
   */
  exec(): void {
    info(this.description)
    this.execCallback.apply(this.generator, this.args)
  }
}
