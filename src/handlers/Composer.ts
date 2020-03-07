import Execution from './Execution'

/**
 * Helper for composer actions
 */
class ComposerHandler {
  /**
   * Global Composer path
   */
  private globalPath: string | null = null

  /**
   * Executable name for composer
   */
  readonly execName: string

  /**
   * Constructor
   */
  constructor() {
    this.execName = Execution.suffixExtIfRunningOnWindows('composer')
  }

  /**
   * Gets global composer path
   *
   * @return string
   */
  getGlobalPath(): string {
    if (this.globalPath === null) {
      this.globalPath = this.getResults(['config', '-g', 'home']).trim()
    }
    return this.globalPath === null ? '' : this.globalPath
  }

  /**
   * Executes composer command and prints to debug results and returns result as string
   *
   * @param Array<string> args Command arguments
   * @param string|null cwd Where to execute
   *
   * @return string
   */
  getResults(args: string[], cwd: string | null = null): string {
    if (cwd === null) {
      cwd = process.cwd()
    }
    return Execution.getResults(
      this.execName,
      args.concat(['--no-interaction', '--ansi']),
      cwd
    )
  }

  /**
   * Executes composer command and prints to debug results
   *
   * @param Array<string> args Command arguments
   * @param string|null cwd Where to execute
   */
  run(args: string[], cwd: string | null = null): void {
    this.getResults(args, cwd)
  }

  /**
   * Remove dev requirements
   */
  removeDevRequirements(): void {
    this.run(['install', '--no-dev'])
  }

  /**
   * Installing dev requirements
   */
  installDevRequirements(): void {
    this.run(['install'])
  }
}

export default new ComposerHandler()
