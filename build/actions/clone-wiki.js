"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const core_1 = require("@actions/core");
const fs_1 = require("fs");
const helpers_1 = require("../helpers");
class default_1 {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Cloning old wiki...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return true;
    }
    /**
     * @inheritDoc
     */
    exec(generator, gitInfo) {
        core_1.info('Cloning old wiki...');
        const oldDocsDir = this.getOldDocsPath();
        if (fs_1.existsSync(oldDocsDir)) {
            throw new Error(oldDocsDir.concat(" already exists but shouldn't"));
        }
        fs_1.mkdirSync(oldDocsDir);
        helpers_1.execCommand('git', ['init'], oldDocsDir);
        helpers_1.execCommand('git', [
            'remote',
            'add',
            'origin',
            `https://${this.getUpdateUser()}:${this.getUpdateToken()}@github.com/${gitInfo.getCurrentRepositoryName()}.wiki.git`
        ], oldDocsDir);
        helpers_1.execCommand('git', ['config', '--local', 'gc.auto', '0'], oldDocsDir);
        helpers_1.execCommand('git', [
            '-c',
            'protocol.version=2',
            'fetch',
            '--no-tags',
            '--prune',
            '--progress',
            '--no-recurse-submodules',
            '--depth=1',
            'origin'
        ], oldDocsDir);
        if (this.branchExist(gitInfo.branchOrTagName, oldDocsDir)) {
            helpers_1.execCommand('git', ['checkout', gitInfo.branchOrTagName], oldDocsDir);
        }
        else {
            helpers_1.execCommand('git', ['checkout', '-b', gitInfo.branchOrTagName], oldDocsDir);
        }
        helpers_1.execCommand('git', ['reset', '--hard'], oldDocsDir);
    }
    /**
     * Checks if branch already exist on dir
     *
     * @param string branch Branch to check
     * @param string cwd Dir where to check
     */
    branchExist(branch, cwd) {
        return (child_process_1.spawnSync('git', ['branch', '--list', branch], {
            cwd
        })
            .output.toString()
            .trim() === branch);
    }
    /**
     * Gets GitHub token that will be used for update action
     */
    getUpdateToken() {
        return core_1.getInput('wiki_github_update_token');
    }
    /**
     * Get GitHub user for witch token belongs
     */
    getUpdateUser() {
        return core_1.getInput('wiki_github_update_user');
    }
    /**
     * Get old docs path
     */
    getOldDocsPath() {
        return core_1.getInput('temp_docs_folder').concat('.old');
    }
}
exports.default = default_1;
