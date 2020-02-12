import GeneratorInterface from "./src/GeneratorInterface";
import GitInfo from "./src/GitInfo";

const core = require('@actions/core');

try {
  const engineName = core.getInput('ENGINE');
  const generator = require(`./src/${engineName}.ts`);

  if (!(generator instanceof GeneratorInterface)) {
    throw new TypeError("Selected engine doesn't implements GeneratorInterface");
  }

  if (!generator.checkIfAllInputOptionsDefined(core.getInput)) {
    throw new TypeError("Not all required arguments defined for selected engine");
  }

  let info = new GitInfo(
      process.cwd()
  );

  require('./src/actions/install').default.exec(generator);
  require('./src/actions/clone-wiki').default.exec(generator);

  generator.before(core.getInput);
  generator.generate(core.getInput);
  generator.after(core.getInput);
} catch (error) {
  core.setFailed(error.message);
}
