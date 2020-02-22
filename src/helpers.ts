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
  const proc = spawnSync(cmd, args, {
    cwd
  })
  if (proc.status === 0) {
    debug(proc.output.join(EOL).trim())
  } else {
    throw new Error(`${cmd} ${args.join(' ')} execution failed`)
  }
}
