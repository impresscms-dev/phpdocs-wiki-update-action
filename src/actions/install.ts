import ActionInterface from '../ActionInterface'
import GeneratorInterface from '../GeneratorInterface'
import {execCommand} from '../helpers'

export default class InstallAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string {
    return 'Installing required composer packages...'
  }

  /**
   * @inheritDoc
   */
  shouldRun(generator: GeneratorInterface): boolean {
    return generator.getComposerRequirements().length > 0
  }

  /**
   * @inheritDoc
   */
  exec(generator: GeneratorInterface): void {
    const packages = generator.getComposerRequirements()
    if (packages.length === 0) {
      return
    }
    execCommand(
      'composer',
      [
        'require',
        '--dev',
        '--no-progress',
        '--no-suggest',
        '--no-interaction',
        '--ansi'
      ].concat(packages),
      process.cwd()
    )
  }
}
