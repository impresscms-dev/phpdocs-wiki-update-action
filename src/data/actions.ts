/**
 * This file defines Actions list in correct order
 */
import ActionInterface from '../ActionInterface';
import InstallAction from '../actions/install';
import CloneWikiAction from '../actions/clone-wiki';
import ExecBeforeGeneratorActionsAction from '../actions/exec-before-generator-actions';
import GenerateAction from '../actions/generate';
import ExecAfterGeneratorActionsAction from '../actions/exec-after-generator-actions';
import FlattenFileStructureAction from '../actions/flatten-file-structure';
import PrefixAction from '../actions/prefix';
import CopyOldGitDataToNewPlaceAction from '../actions/copy-old-git-data-to-new-place';
import ConfigureCommitAuthorAction from '../actions/configure-commit-author';
import CheckStatusAction from '../actions/check-status';
import CommitAction from '../actions/commit';
import PushUpdateAction from '../actions/push-update';
import UninstallAction from '../actions/uninstall';
import RemoveNotRequiredFilesAction from '../actions/remove-not-required-files';
import GlobalInstallAction from '../actions/global-install';
import GlobalUninstallAction from '../actions/global-uninstall';
import GlobalSetConfigAction from '../actions/global-set-config';
import SetConfigAction from '../actions/set-config';
import BackupComposerFilesAction from '../actions/backup-composer-files-action';
import RestoreComposerFiles from '../actions/restore-composer-files';
import InitTempPathsAction from '../actions/init-tmp-paths';
import ValidateMainParamsAction from '../actions/validate-main-params';

const actions: ActionInterface[] = [
  new ValidateMainParamsAction(),
  new InitTempPathsAction(),
  new BackupComposerFilesAction(),
  new GlobalSetConfigAction(),
  new GlobalInstallAction(),
  new SetConfigAction(),
  new InstallAction(),
  new CloneWikiAction(),
  new ExecBeforeGeneratorActionsAction(),
  new GenerateAction(),
  new ExecAfterGeneratorActionsAction(),
  new FlattenFileStructureAction(),
  new PrefixAction(),
  new CopyOldGitDataToNewPlaceAction(),
  new ConfigureCommitAuthorAction(),
  new CheckStatusAction(),
  new CommitAction(),
  new PushUpdateAction(),
  new RestoreComposerFiles(),
  new UninstallAction(),
  new GlobalUninstallAction(),
  new RemoveNotRequiredFilesAction()
];

export default actions;