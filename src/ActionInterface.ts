import GeneratorInterface from "./GeneratorInterface";
import GitInfo from "./GitInfo";

export default interface ActionInterface {

    /**
     * Executes action
     *
     * @param GeneratorInterface generator linked generator
     * @param GitInfo info Linked git info
     */
    exec(generator: GeneratorInterface, info: GitInfo): void;

    /**
     * Gets action description
     */
    getDescription(): string|null;

    /**
     * Should this action run?
     *
     * @param GeneratorInterface generator linked generator
     * @param GitInfo info Linked git info
     */
    shouldRun(generator: GeneratorInterface, info: GitInfo): boolean;
};