import {setFailed} from '@actions/core'
import {execGenerator, getSelectedEngineName} from './helpers'

try {
  (async () => {
    await execGenerator(
      getSelectedEngineName()
    )
  })()
} catch (error) {
  setFailed(error.message)
}
