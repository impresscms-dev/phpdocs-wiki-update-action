import {debug} from '@actions/core'
import {spawnSync} from 'child_process'
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
    env: {[x: string]: string} = {}
  ): void {
    this.getResults(cmd, args, cwd, env)
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
}

export default new ExecutionHandler()
