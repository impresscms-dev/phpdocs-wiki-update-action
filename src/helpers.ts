import Execution from './handlers/Execution'

/**
 * Data that is cached
 */
const cachedData: {composerGlobalPath: null | string} = {
  composerGlobalPath: null
}

/**
 * Executes composer command and prints to debug results
 *
 * @param Array<string> args Command arguments
 * @param string|null cwd Where to execute
 */
export function composer(args: string[], cwd: string | null = null): void {
  composerWithReturn(args, cwd)
}

/**
 * Executes composer command and prints to debug results and returns result as string
 *
 * @param Array<string> args Command arguments
 * @param string|null cwd Where to execute
 *
 * @return string
 */
export function composerWithReturn(
  args: string[],
  cwd: string | null = null
): string {
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
  return Execution.getResults(
    cmd,
    args.concat(['--no-interaction', '--ansi']),
    cwd
  )
}

/**
 * Gets global composer path
 *
 * @return string
 */
export function getGlobalComposerPath(): string {
  if (cachedData.composerGlobalPath === null) {
    cachedData.composerGlobalPath = composerWithReturn([
      'config',
      '-g',
      'home'
    ]).trim()
  }
  return cachedData.composerGlobalPath
}
