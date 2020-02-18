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
   * Action to execute
   */
  protected readonly actions: string[] = [
    'install',
    'clone-wiki',
    'exec-before-generator-actions',
    'generate',
    'exec-after-generator-actions',
    'flatten-file-structure',
    'prefix',
    'copy-old-git-data-to-new-place',
    'configure-commit-author',
    'check-status',
    'commit',
    'push-update'
  ]

  /**
   * Constructor
   */
  constructor() {
    this.generator = this.makeGeneratorInstance()
    this.gitInfo = new GitInfo(process.cwd())
  }

  /**
   * Validates all parameters before starting generator
   */
  validate(): void {
    if (!this.generator.checkIfAllInputOptionsDefined()) {
      throw new TypeError(
        'Not all required arguments defined for selected engine'
      )
    }
  }

  /**
   * Get all actions instances that should run
   */
  getAllActions(): ActionInterface[] {
    return this.actions
      .map((action: string) => {
        return require(`./actions/${action}`).default
      })
      .filter((actionInstance: ActionInterface) =>
        actionInstance.shouldRun(this.generator, this.gitInfo)
      )
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
