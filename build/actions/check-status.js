"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const helpers_1 = require("../helpers");
class default_1 {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Configure git changes status...';
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
    exec() {
        const cwd = core_1.getInput('temp_docs_folder');
        helpers_1.execCommand('git', ['status'], cwd);
    }
}
exports.default = default_1;
