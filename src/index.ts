import {info, setFailed} from '@actions/core'
import GitInfo from './GitInfo'
import GeneratorInterface from './GeneratorInterface'
import ActionInterface from './ActionInterface'

class Main {
  /**
   * Current generator instance
   */
  readonly generator: GeneratorInterface
  /**
   * GitInfo of main repo
   */
  readonly gitInfo: GitInfo

  /**
   * Constructor
   */
  constructor() {
    this.generator = this.makeGeneratorInstance()
    this.gitInfo = new GitInfo(process.cwd())
  }

  /**
   * Get all actions instances that should run
   */
  getAllActions(): ActionInterface[] {
    const ret = [];


    this.actions.forEach(
      (actionName: string) => {
        const included: ActionInterface = (async () => {
          return await import(`./actions/${action}`);
        })
      }
    )

    return
  .
    map(
      (action: string) => dynamicInclude(`./actions/${action}`)
    )
      .filter((actionInstance: ActionInterface) =>
        actionInstance.shouldRun(this.generator, this.gitInfo)
      )
  }

  /**
   * Loads action
   *
   * @param string action Action name
   */
  protected loadAction(action: string): Promise<ActionInterface> {
    return import(`./actions/${action}`)
  }

  /**
   * Gets engine name
   */
  protected getEngineName(): string {
    return 'phpdoc-md'
    //return getInput('engine')
  }

  /**
   * Makes generator instance
   */
  protected makeGeneratorInstance(): GeneratorInterface {
    const name = `./generators/${this.getEngineName()}`
    const signature = require(name).default
    return new signature()
  }
}

try {
  const app = new Main()
  app.validate()
  for (const actionInstance of app.getAllActions()) {
    const desc = actionInstance.getDescription()
    if (desc !== null) {
      info(desc)
    }
    actionInstance.exec(app.generator, app.gitInfo)
  }
} catch (error) {
  setFailed(error.message)
}
