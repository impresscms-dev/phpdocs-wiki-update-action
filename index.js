import GeneratorInterface from "./src/GeneratorInterface";
import GitInfo from "./src/GitInfo";
import ActionInterface from "./src/ActionInterface";

const core = require('@actions/core');

try {
  const engineName = core.getInput('ENGINE');
  const generatorName = require(`./src/${engineName}.ts`);
  const generator = new generatorName();

  if (!(generator instanceof GeneratorInterface)) {
    throw new TypeError("Selected engine doesn't implements GeneratorInterface");
  }

  if (!generator.checkIfAllInputOptionsDefined(core.getInput)) {
    throw new TypeError("Not all required arguments defined for selected engine");
  }

  let info = new GitInfo(
      process.cwd()
  );

  [
      'install',
      'clone-wiki',
      'exec-before-generator-actions',
      'generate',
      'exec-after-generator-actions',
      'flatten-file-structure',
      'prefix',
      'copy-old-git-data-to-new-place',
      'configure-commit-author',
      'check-status',
      'commit',
      'push-update'
  ].map(
      (action) => require(`./src/actions/${action}`).default
  ).filter(
      (actionInstance) => (actionInstance instanceof ActionInterface) && actionInstance.shouldRun(generator, info)
  ).forEach(
      (actionInstance) => {
        let desc = actionInstance.getDescription();
        if (desc !== null) {
          core.info(desc);
        }
        actionInstance.exec(generator, info);
      }
  )
} catch (error) {
  core.setFailed(error.message);
}
