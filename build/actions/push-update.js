"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const helpers_1 = require("../helpers");
class default_1 {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Pushing docs update...';
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
        helpers_1.execCommand('git', ['push', '-u', 'origin', info.branchOrTagName], cwd);
    }
}
exports.default = default_1;
