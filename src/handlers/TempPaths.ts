import {tmpdir} from 'os'
import {createHash} from 'crypto'
import {existsSync, mkdirSync} from 'fs'
import {join} from 'path'
import {debug} from '@actions/core'
import PathAlreadyAddedError from "../errors/PathAlreadyAddedError";
import PathIsNotYetAddedError from "../errors/PathIsNotYetAddedError";

/**
 * Deals with temp paths
 */
class TempPathsHandler {
  /**
   * Stores paths
   */
  protected paths: { [x: string]: string } = {}

  /**
   * Checks if such path is already added
   *
   * @param string type Path type
   *
   * @return boolean
   */
  isSet(type: string): boolean {
    return typeof this.paths[type] !== 'undefined'
  }

  /**
   * Generates new path in array
   *
   * @param string type Path short name (aka type)
   * @param boolean create Do we need automatically to create path?
   */
  add(type: string, create: boolean = true): void {
    if (this.isSet(type)) {
      throw new PathAlreadyAddedError(type);
    }
    this.paths[type] = this.generateUniqueTmpDirPath(type)
    if (create) {
      mkdirSync(this.paths[type])
    }
  }

  /**
   * Generates unique temp dir path
   *
   * @param string type Path type
   *
   * @return string
   */
  private generateUniqueTmpDirPath(type: string): string {
    let path
    const tmpPathBase = tmpdir()
    const hash = createHash('sha1')
    while (
      existsSync(
        (path = join(
          tmpPathBase,
          type.concat('-', hash.update(Date.now().toString()).digest('hex'))
        ))
      )
    );
    return path
  }

  /**
   * Gets path by type
   *
   * @param string type Path type
   */
  get(type: string): string {
    if (!this.isSet(type)) {
      throw new PathIsNotYetAddedError(type);
    }
    return this.paths[type]
  }

  /**
   * Prints debug info
   */
  debug(): void {
    debug(`Registered paths:`)
    for (const type in this.paths) {
      debug(`  ${type} = ${this.paths[type]}`)
    }
  }

  /**
   * Adds subpath as alias
   *
   * @param string type New type
   * @param string originalType Original type
   * @param string path Sub path
   */
  addSubpathAlias(type: string, originalType: string, path: string): void {
    if (this.isSet(type)) {
      throw new PathAlreadyAddedError(type);
    }
    if (!this.isSet(originalType)) {
      throw new PathIsNotYetAddedError(originalType);
    }
    this.paths[type] = join(this.get(originalType), path)
  }

  /**
   * Get all entries
   *
   * @return array
   */
  getEntries(): [string, string][] {
    return Object.entries(this.paths)
  }

  /**
   * Gets all registered paths
   *
   * @return string[]
   */
  getAllPaths(): string[] {
    return Object.values(this.paths)
  }

  /**
   * Get filename for type
   *
   * @param string type Type of path
   * @param string relativePath Filename to get (relative)
   *
   * @return string
   */
  getFilename(type: string, relativePath: string): string {
    return join(this.get(type), relativePath)
  }
}

export default new TempPathsHandler()
