import ActionInterface from "../ActionInterface";
import {debug, getInput} from "@actions/core";
import GeneratorInterface from "../GeneratorInterface";
import GitInfo from "../GitInfo";
import GeneratorActionStepDefinition from "../GeneratorActionStepDefinition";
import readDirSync from 'recursive-readdir-sync';
import {readFileSync, writeFileSync} from 'fs';

export default class implements ActionInterface {

    /**
     * @inheritDoc
     */
    getDescription(): string|null {
        return 'Prefixing file lines...';
    }

    /**
     * @inheritDoc
     */
    shouldRun(generator: GeneratorInterface, info: GitInfo): boolean {
        return this.getPrefixLines().length > 0;
    }

    /**
     * @inheritDoc
     */
    exec(generator: GeneratorInterface, info: GitInfo): void {
        const newDocs = getInput('TEMP_DOCS_FOLDER');
        const prefix = this.getPrefixLines();
        readDirSync(newDocs).forEach(
            (file) => {
                debug(' '  + file);
                writeFileSync(
                    file,
                    prefix + readFileSync(file)
                );
            }
        )
    }

    /**
     * Gets prefix that should be used for each file
     */
    protected getPrefixLines() : string {
        return getInput('PREFIX_LINES');
    }
};