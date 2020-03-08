import {error, getInput, info, setFailed} from '@actions/core'
import actions from './data/actions'
import generators from './data/generators'
import Execution from "./handlers/Execution";

try {
  const generatorName = getInput('engine')
  if (typeof generators[generatorName] == 'undefined') {
    throw new Error('Unknown selected generator name')
  }
  const generator = generators[generatorName]
  if (!generator.checkIfAllInputOptionsDefined()) {
    throw new TypeError(
      'Not all required arguments defined for selected engine'
    )
  }

  for (const action of actions) {
    if (!action.shouldRun(generator)) {
      continue
    }
    const desc = action.getDescription()
    if (desc !== null) {
      info(desc)
    }
    action.exec(generator)
  }
} catch (err) {
  for (const line of err.stack.split('\n')) {
    error(line)
  }
  setFailed(err.message)
}