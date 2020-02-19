"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const fs_1 = require("fs");
const readDirSync = require("recursive-readdir-sync");
class default_1 {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Prefixing file lines...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return this.getPrefixLines().length > 0;
    }
    /**
     * @inheritDoc
     */
    exec() {
        const newDocs = core_1.getInput('temp_docs_folder');
        const prefix = this.getPrefixLines();
        for (const file of readDirSync(newDocs)) {
            core_1.debug(' '.concat(file.toString()));
            fs_1.writeFileSync(file.toString(), prefix.concat(fs_1.readFileSync(file.toString()).toString()));
        }
    }
    /**
     * Gets prefix that should be used for each file
     */
    getPrefixLines() {
        return core_1.getInput('prefix_lines');
    }
}
exports.default = default_1;
