import {debug} from '@actions/core'
import {spawnSync} from 'child_process'
import {EOL} from 'os'

/**
 * Executes command and prints to debug results
 *
 * @param string cmd  Command to be executed
 * @param Array<string> args Command arguments
 * @param string cwd Where to execute
 */
export function execCommand(cmd: string, args: string[], cwd: string): void {
  execCommandAndReturn(cmd, args, cwd)
}

/**
 * Executes command and return result as string
 *
 * @param string cmd  Command to be executed
 * @param Array<string> args Command arguments
 * @param string cwd Where to execute
 */
export function execCommandAndReturn(
  cmd: string,
  args: string[],
  cwd: string
): string {
  debug(` Executing ${cmd} ${args.join(' ')} in ${cwd}...`)
  const proc = spawnSync(cmd, args, {
    cwd
  })
  if (proc.status === 0) {
    const out = proc.output.join(EOL).trim()
    debug(out)
    return out
  }
  throw new Error(`Execution failed`)
}
