"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
/**
 * Class to define generator action step
 */
class GeneratorActionStepDefinition {
    /**
     * Constructor
     *
     * @param GeneratorInterface|null generator Linked generator
     * @param string description Description to print for step
     * @param Function execCallback Callback that will be executed for action
     * @param args any extra args
     */
    constructor(generator, description, execCallback, ...args) {
        this.description = description;
        this.execCallback = execCallback;
        this.args = args;
        this.generator = generator;
    }
    /**
     * Executes action
     *
     * @param gitInfo
     */
    exec(gitInfo) {
        core_1.info(this.description);
        const args = [core_1.getInput, gitInfo].concat(this.args);
        this.execCallback.apply(this.generator, args);
    }
}
exports.default = GeneratorActionStepDefinition;
