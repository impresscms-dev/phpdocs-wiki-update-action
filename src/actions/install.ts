import ActionInterface from "../ActionInterface";
import {spawnSync} from "child_process";
import {debug} from "@actions/core";

export default class implements ActionInterface {

    /**
     * @inheritDoc
     */
    exec(generator: import("../GeneratorInterface").default): void {
        let packages = generator.getComposerRequirements();
        if (packages.length == 0) {
            return;
        }
        debug(
            spawnSync(
                'composer',
                [
                    'require',
                    '--dev'
                ].concat(packages)
            ).output.toString()
        );
    }
};