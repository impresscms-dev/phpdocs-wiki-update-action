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

const actions: ActionInterface[] = [
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
  new UninstallAction(),
  new RemoveNotRequiredFilesAction()
]

export default actions
