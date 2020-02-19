"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const helpers_1 = require("../helpers");
class default_1 {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Committing docs update...';
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
    exec(generator, info) {
        const cwd = core_1.getInput('temp_docs_folder');
        helpers_1.execCommand('git', ['add', '-u', ':/'], cwd);
        helpers_1.execCommand('git', ['add', '.'], cwd);
        try {
            helpers_1.execCommand('git', [
                'commit',
                '-m',
                `Automatically generated for https://github.com/${info.getCurrentRepositoryName()}/commit/${info.getCurrentLastCommitSHA()}`
            ], cwd);
        }
        catch (e) {
            core_1.debug('Nothing to commit');
        }
    }
}
exports.default = default_1;
