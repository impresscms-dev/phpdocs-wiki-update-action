import ActionInterface from '../ActionInterface'
import {getInput} from '@actions/core'
import ConfigItemMustBeAtLeastCharactersError from "../errors/ConfigItemMustBeAtLeastCharactersError"

export default class ValidateMainParamsAction implements ActionInterface {
  /**
   * @inheritDoc
   */
  getDescription(): string | null {
    return 'Validating main parameters...'
  }

  /**
   * @inheritDoc
   */
  shouldRun(): boolean {
    return true
  }

  /**
   * @inheritDoc
   */
  exec(): void {
    getInput('wiki_github_update_user', {required: true})
    if (
      getInput('wiki_github_update_token', {
        required: true
      }).length < 40
    ) {
      throw new ConfigItemMustBeAtLeastCharactersError('wiki_github_update_token', 40)
    }
  }
}
