import ActionInterface from "../ActionInterface";
import {getInput} from "@actions/core";
import GeneratorInterface from "../GeneratorInterface";
import GitInfo from "../GitInfo";
import GeneratorActionStepDefinition from "../GeneratorActionStepDefinition";

export default class implements ActionInterface {

    /**
     * @inheritDoc
     */
    getDescription(): string|null {
        return null;
    }

    /**
     * @inheritDoc
     */
    shouldRun(generator: GeneratorInterface, info: GitInfo): boolean {
        return generator.getBeforeActions(getInput, info).length > 0;
    }

    /**
     * @inheritDoc
     */
    exec(generator: GeneratorInterface, info: GitInfo): void {
        generator.getBeforeActions(getInput, info).forEach(
            (definition: GeneratorActionStepDefinition) => definition.exec(info)
        );
    }
};