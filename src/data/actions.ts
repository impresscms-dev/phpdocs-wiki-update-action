/**
 * This file defines Actions list in correct order
 */
import InstallAction from '../actions/install'
import CloneWikiAction from '../Actions/clone-wiki'
import ExecBeforeGeneratorActionsAction from '../Actions/exec-before-generator-Actions'
import GenerateAction from '../Actions/generate'
import ExecAfterGeneratorActionsAction from '../Actions/exec-after-generator-Actions'
import FlattenFileStructureAction from '../Actions/flatten-file-structure'
import PrefixAction from '../Actions/prefix'
import CopyOldGitDataToNewPlaceAction from '../Actions/copy-old-git-data-to-new-place'
import ConfigureCommitAuthorAction from '../Actions/configure-commit-author'
import CheckStatusAction from '../Actions/check-status'
import CommitAction from '../Actions/commit'
import PushUpdateAction from '../Actions/push-update'
import ActionInterface from '../ActionInterface'
import UninstallAction from '../actions/uninstall'
import RemoveNotRequiredFilesAction from '../actions/remove-not-required-files'
import GlobalInstallAction from '../actions/global-install'
import GlobalUninstallAction from '../actions/global-uninstall'
import GlobalSetConfigAction from '../actions/global-set-config'
import SetConfigAction from '../actions/set-config'
import BackupComposerFilesAction from '../actions/backup-composer-files-action'
import RestoreComposerFiles from '../actions/restore-composer-files'
import InitTempPathsAction from '../actions/init-tmp-paths'
import ValidateMainParamsAction from '../actions/validate-main-params'

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
]

export default actions
