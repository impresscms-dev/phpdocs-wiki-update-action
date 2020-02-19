"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Generating documentation...';
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
        generator.generate(info);
    }
}
exports.default = default_1;
