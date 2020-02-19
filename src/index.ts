import {info, setFailed} from '@actions/core'
import GitInfo from './GitInfo'
import GeneratorInterface from './GeneratorInterface'
import ActionInterface from './ActionInterface'
import {getAllActionsInstances, getSelectedEngineName, makeGeneratorInstance, validateGenerator} from './helpers'

try {
  makeGeneratorInstance(getSelectedEngineName()).then(
    (generator: GeneratorInterface) => {
      validateGenerator(generator)
      const gitInfo = GitInfo.createInstance()
      getAllActionsInstances().then((actions: ActionInterface[]) => {
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
      })
    }
  )
} catch (error) {
  setFailed(error.message)
}
