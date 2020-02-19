"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const fs = require("fs-extra");
class default_1 {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Updating docs folder...';
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
        const newDocs = core_1.getInput('temp_docs_folder');
        const oldDocs = newDocs.concat('.old');
        fs.copySync(oldDocs.concat('/.git'), newDocs.concat('/.git'), {
            preserveTimestamps: true
        });
    }
}
exports.default = default_1;
