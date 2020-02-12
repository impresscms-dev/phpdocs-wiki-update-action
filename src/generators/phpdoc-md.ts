import GeneratorInterface from "../GeneratorInterface";
import {getInput, InputOptions} from '@actions/core';

export default class PHPDocMDGenerator implements GeneratorInterface {

    /**
     * @inheritDoc
     */
    after(): void {
    }

    /**
     * @inheritDoc
     */
    before(): void {

    }

    /**
     * @inheritDoc
     */
    generate(): void {
    }

    /**
     * @inheritDoc
     */
    getComposerRequirements(): Array<string> {
        return [
            "clean/phpdoc-md"
        ];
    }

    /**
     * @inheritDoc
     */
    checkIfAllInputOptionsDefined(getInput: (name: string, options?: InputOptions) => string): boolean {
        return getInput('CLASS_ROOT_NAMESPACE').length > 0 && getInput('INCLUDE').length > 0;
    }

};