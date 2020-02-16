import {getInput, info} from '@actions/core'
import GitInfo from './GitInfo'
import GeneratorInterface from './GeneratorInterface'

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
  readonly generator: GeneratorInterface | null

  /**
   * Constructor
   *
   * @param GeneratorInterface|null generator Linked generator
   * @param string description Description to print for step
   * @param Function execCallback Callback that will be executed for action
   * @param args any extra args
   */
  constructor(
    generator: GeneratorInterface | null,
    description: string,
    execCallback: Function,
    ...args: any[]
  ) {
    this.description = description
    this.execCallback = execCallback
    this.args = args
    this.generator = generator
  }

  /**
   * Executes action
   *
   * @param gitInfo
   */
  exec(gitInfo: GitInfo): void {
    info(this.description)
    let args = [getInput, gitInfo].concat(this.args)
    this.execCallback.apply(this.generator, args)
  }
}
