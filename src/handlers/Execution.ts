import {debug} from '@actions/core'
import {spawnSync} from 'child_process'
import {EOL} from 'os'
import ExecutionFailedError from "../errors/ExecutionFailedError";

/**
 * Works with files executions
 */
class ExecutionHandler {
  /**
   * Replace Windows path separator with Unix
   *
   * @param string path Path to replace
   *
   * @return string
   */
  replaceWinPathCharToUnix(path: string): string {
    return path.replace(/\\/g, '/')
  }

  /**
   * Executes command and prints to debug results
   *
   * @param string cmd  Command to be executed
   * @param Array<string> args Command arguments
   * @param string cwd Where to execute
   * @param object env Environment variables data
   */
  run(
    cmd: string,
    args: string[],
    cwd: string,
    env: {[x: string]: string} = {}
  ): void {
    this.getResults(cmd, args, cwd, env)
  }

  /**
   * Prints running command
   *
   * @param string cmd  Command to be executed
   * @param Array<string> args Command arguments
   * @param string cwd Where to execute
   * @param object env Environment variables data
   */
  protected printRunningCommand(
    cmd: string,
    args: string[],
    cwd: string,
    env: {[x: string]: string}
  ): void {
    const fullCommand = Object.entries(env)
      .map(([key, value]) => {
        let escVal = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
        if (escVal.includes(' ') || escVal.includes('*')) {
          escVal = `"${escVal}"`
        }
        return `${key}=${escVal}`
      })
      .join(' ')
      .concat(' ', this.render(cmd, args))
    debug(` Executing ${fullCommand} in ${cwd}...`)
  }

  /**
   * Renders command
   *
   * @param string cmd Command to render
   * @param string[] args Command arguments
   */
  render(cmd: string, args: string[] = []): string {
    return cmd
      .concat(' ', args.map(arg => this.escapeShellArg(arg)).join(' '))
      .trim()
  }

  /**
   * Prepares ENV options array
   *
   * @param object env Env data
   *
   * @return object
   */
  protected prepareEnvOptions(env: {
    [x: string]: string
  }): {[x: string]: string} {
    return Object.assign({}, process.env, env)
  }

  /**
   * Escapes shell arg
   *
   * @param string arg Argument to escape
   *
   * @return string
   */
  escapeShellArg(arg: string): string {
    let ret = ''

    ret = arg.replace(/[^\\]'/g, (m: string) => {
      return m.slice(0, 1).concat("\\'")
    })

    if (ret.includes(' ') || ret.includes('*')) {
      return `'${ret}'`
    }

    return ret
  }

  /**
   * Executes command and return result as string
   *
   * @param string cmd  Command to be executed
   * @param Array<string> args Command arguments
   * @param string cwd Where to execute
   * @param object env Environment variables data
   *
   * @return string
   */
  getResults(
    cmd: string,
    args: string[],
    cwd: string,
    env: {[x: string]: string} = {}
  ): string {
    this.printRunningCommand(cmd, args, cwd, env)
    const envOptions = this.prepareEnvOptions(env)
    const proc = spawnSync(cmd, args, {cwd, env: envOptions})
    const out = proc.output
      ?.join('\n')
      .trim()
      .replace(/\n/g, EOL);
    for (const outputLine of out.split(EOL)) {
      debug(outputLine.trim());
    }
    if (proc.status === 0) {
      return out;
    }
    throw new ExecutionFailedError(out);
  }

  /**
   * Is running on Windows?
   *
   * @return boolean
   */
  isRunningOnWindows(): boolean {
    return (
      process.platform.toString() === 'win32' ||
      process.platform.toString() === 'win64'
    )
  }

  /**
   * Sufixes file extension if running on windows
   *
   * @param string filename Filename for witch add extension
   * @param string winExt Extension to add
   */
  suffixExtIfRunningOnWindows(
    filename: string,
    winExt: string = 'bat'
  ): string {
    return this.isRunningOnWindows() ? filename.concat('.', winExt) : filename
  }
}

export default new ExecutionHandler()
