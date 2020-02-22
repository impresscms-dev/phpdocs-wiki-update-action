import {debug, getInput, info, setFailed} from '@actions/core'
import actions from './data/actions'
import generators from './data/generators'
import GitInfo from './GitInfo'

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

  const gitInfo = GitInfo.createInstance()
  for (const action of actions) {
    if (!action.shouldRun(generator, gitInfo)) {
      continue
    }
    const desc = action.getDescription()
    if (desc !== null) {
      info(desc)
    }
    action.exec(generator, gitInfo)
  }
} catch (error) {
  debug(error)
  setFailed(error.message)
}
