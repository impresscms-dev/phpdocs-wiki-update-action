"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
class default_1 {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Installing required composer packages...';
    }
    /**
     * @inheritDoc
     */
    shouldRun(generator) {
        return generator.getComposerRequirements().length > 0;
    }
    /**
     * @inheritDoc
     */
    exec(generator) {
        const packages = generator.getComposerRequirements();
        if (packages.length === 0) {
            return;
        }
        helpers_1.execCommand('composer', ['require', '--dev'].concat(packages), process.cwd());
    }
}
exports.default = default_1;
