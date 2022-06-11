import {error, getInput, info, setFailed} from '@actions/core'
import actions from './data/actions'
import generators from './data/generators'
import UnknownSelectedGeneratorNameError from "./errors/UnknownSelectedGeneratorNameError";
import NotAllRequiredArgumentsDefinedForSelectedEngineError
  from "./errors/NotAllRequiredArgumentsDefinedForSelectedEngineError";

try {
  const generatorName = getInput('engine', {required: false})
  if (typeof generators[generatorName] == 'undefined') {
    throw new UnknownSelectedGeneratorNameError();
  }
  const generator = generators[generatorName];
  if (!generator.checkIfAllInputOptionsDefined()) {
    throw new NotAllRequiredArgumentsDefinedForSelectedEngineError();
  }

  for (const action of actions) {
    if (!action.shouldRun(generator)) {
      continue;
    }
    const desc = action.getDescription();
    if (desc !== null) {
      info(desc);
    }
    action.exec(generator);
  }
} catch (err) {
  if (err instanceof Error) {
    if (err.stack) {
      for (const line of err.stack.split('\n')) {
        error(line);
      }
    }
    setFailed(err.message);
  } else {
    setFailed(
      String(err)
    );
  }
}
