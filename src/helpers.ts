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
  const proc = spawnSync(cmd, args, {cwd})
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
 * Executes composer command and prints to debug results
 *
 * @param Array<string> args Command arguments
 * @param string|null cwd Where to execute
 */
export function composer(args: string[], cwd: string | null = null): void {
  if (cwd === null) {
    cwd = process.cwd()
  }
  let cmd = 'composer'
  if (
    process.platform.toString() === 'win32' ||
    process.platform.toString() === 'win64'
  ) {
    cmd = 'composer.bat'
  }
  execCommandAndReturn(cmd, args.concat(['--no-interaction', '--ansi']), cwd)
}
