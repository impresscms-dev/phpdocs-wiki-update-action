import * as core from "@actions/core";
import {InputOptions} from "@actions/core";

export default interface GeneratorInterface {

    /**
     * If some composer packages are needed gets list names for installation
     */
    getComposerRequirements(): Array<string>;

    /**
     * Executes this action before generating documentation
     *
     * @param callback getInput Get input argument
     */
    before(getInput: (name: string, options?: InputOptions) => string): void;

    /**
     * Generate documentation
     *
     * @param callback getInput Get input argument
     */
    generate(getInput: (name: string, options?: InputOptions) => string): void;

    /**
     * Executes this action after generation
     *
     * @param callback getInput Get input argument
     */
    after(getInput: (name: string, options?: InputOptions) => string): void;

    /**
     * Checks if all required input options are defined for generator
     *
     * @param callback getInput Get input argument
     *
     * @return boolean
     */
    checkIfAllInputOptionsDefined(getInput: (name: string, options?: InputOptions) => string): boolean;

}