import {debug, error} from '@actions/core'
import {spawn, spawnSync} from 'child_process'
import {EOL} from 'os'

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
    env: { [x: string]: string } = {}
  ): void {
    const envOptions = this.prepareEnvOptions(env)
    debug(` Executing ${cmd} ${args.join(' ')} in ${cwd}...`)
    const execOptions = {
      cwd,
      env: envOptions,
      detached: false,
      stdio: 'pipe',
      encoding: 'utf8'
    }

    try {
      const bg = this.backgroundRun
      ;(async () => {
        await bg(cmd, args, execOptions)
      })()
    } catch (e) {
      throw new Error(`Execution failed`)
    }
  }

  /**
   * Runs in bg
   *
   * @param string cmd  Command to be executed
   * @param Array<string> args Command arguments
   * @param object execOptions Execution options
   */
  protected backgroundRun(
    cmd: string,
    args: string[],
    execOptions: { [x: string]: string | object | boolean }
  ): Promise<void> {
    const childProcess = spawn(cmd, args, execOptions)
    childProcess.stderr.on('data', (err: string) => {
      error(err)
    })
    childProcess.stdout.on('data', (data: string) => {
      debug(data)
    })

    return new Promise((resolve, reject) => {
      childProcess.on('close', code => {
        if (code !== 0) {
          reject(code)
          return
        }
        resolve()
      })
    })
  }

  /*
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
    env: { [x: string]: string }
  ): void {
    const fullCommand = Object.entries(env)
      .map(([key, value]) => {
        const escVal = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
        return `${key}="${escVal}"`
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
  }): { [x: string]: string } {
    return Object.assign({}, process.env, env)
  }

  /**
   * Escapes shell arg
   *
   *  discuss at: https://locutus.io/php/escapeshellarg/
   * original by: Felix Geisendoerfer (https://www.debuggable.com/felix)
   * improved by: Brett Zamir (https://brett-zamir.me)
   *   example 1: escapeshellarg("kevin's birthday")
   *   returns 1: "'kevin\\'s birthday'"
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

    return "'".concat(ret, "'")
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
    env: { [x: string]: string } = {}
  ): string {
    debug(` Executing ${cmd} ${args.join(' ')} in ${cwd}...`)
    const envOptions = Object.assign({}, process.env, env)
    const proc = spawnSync(cmd, args, {cwd, env: envOptions})
    const out = proc.output
      ?.join('\n')
      .trim()
      .replace(/\n/g, EOL)
    for (const outputLine of out.split(EOL)) {
      debug(outputLine.trim())
    }
    if (proc.status === 0) {
      return out
    }
    throw new Error(`Execution failed`)
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
