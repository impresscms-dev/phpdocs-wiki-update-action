import ActionInterface from "../ActionInterface";
import {getInput} from "@actions/core";
import GeneratorInterface from "../GeneratorInterface";
import GitInfo from "../GitInfo";

export default class implements ActionInterface {

    /**
     * @inheritDoc
     */
    getDescription(): string|null {
        return 'Updating docs folder...';
    }

    /**
     * @inheritDoc
     */
    shouldRun(generator: GeneratorInterface, info: GitInfo): boolean {
        return true;
    }

    /**
     * @inheritDoc
     */
    exec(generator: GeneratorInterface, info: GitInfo): void {
        const fs = require('fs-extra');
        const newDocs = getInput('TEMP_DOCS_FOLDER');
        const oldDocs = newDocs + '.old';
        fs.copySync(oldDocs + '/.git', newDocs + '/.git', {preserveTimestamps : true});
    }
};