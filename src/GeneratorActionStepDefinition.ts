import {InputOptions, info, getInput} from "@actions/core";
import GitInfo from "./GitInfo";
import GeneratorInterface from "./GeneratorInterface";

/**
 * Class to define generator action step
 */
export default class GeneratorActionStepDefinition {

    /**
     * Description of action
     */
    public readonly description: string;

    /**
     * Callback for action
     */
    public readonly execCallback: Function;

    /**
     * Extra arguments for callback
     */
    public readonly args: Array<any>;

    /**
     * Linked generator
     */
    public readonly generator: GeneratorInterface;

    /**
     * Constructor
     *
     * @param GeneratorInterface generator Linked generator
     * @param string description Description to print for step
     * @param Function execCallback Callback that will be executed for action
     * @param args any extra args
     */
    constructor(generator: GeneratorInterface, description: string, execCallback: Function, ...args: Array<any>) {
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
    exec(gitInfo: GitInfo): void {
        info(this.description);
        let args = [
            getInput,
            gitInfo
        ].concat(this.args);
        this.execCallback.apply(this.generator, args);
    }

}