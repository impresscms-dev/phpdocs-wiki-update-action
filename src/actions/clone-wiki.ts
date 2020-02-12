import ActionInterface from "../ActionInterface";
import {spawnSync} from "child_process";
import {debug, info, getInput} from "@actions/core";
import {existsSync, mkdirSync} from "fs";

export default class implements ActionInterface {

    /**
     * @inheritDoc
     */
    exec(generator: import("../GeneratorInterface").default): void {
        info('Cloning old wiki...');
        let oldDocsDir = this.getOldDocsPath();
        if (existsSync(oldDocsDir)) {
            throw new Error(oldDocsDir + ' already exists but shouldn\'t');
        }
        mkdirSync(oldDocsDir);
        this.execCommand('git', ['init'], oldDocsDir);
        this.execCommand('git', [
            'remote',
            'add',
            'origin',
            `https://${this.getUpdateUser()}:${this.getUpdateToken()}@github.com/${this.getCurrentRepositoryName()}.wiki.git`
        ], oldDocsDir);
        this.execCommand('git', [
            'config',
            '--local',
            'gc.auto',
            '0'
        ], oldDocsDir);
        this.execCommand('git', [
            '-c',
            'protocol.version=2',
            'fetch',
            '--no-tags',
            '--prune',
            '--progress',
            '--no-recurse-submodules',
            '--depth=1',
            'origin'
        ], oldDocsDir);
        //git checkout ${BRANCH_NAME} 2>/dev/null || git checkout -b ${BRANCH_NAME}
        this.execCommand('git', [
            'reset',
            '--hard'
        ], oldDocsDir);
    }

    protected getCurrentRepositoryName(): string {
        // todo: make this dynamical
        return '???';
    }

    protected getUpdateToken(): string {
        return getInput('WIKI_GITHUB_UPDATE_TOKEN');
    }

    protected getUpdateUser(): string {
        return getInput('WIKI_GITHUB_UPDATE_USER');
    }

    protected getOldDocsPath(): string {
        return getInput('TEMP_DOCS_FOLDER') + '.old';
    }

    protected execCommand(cmd: string, args: Array<string>, cwd) {
        debug(
            spawnSync(
                cmd,
                args,
                {
                    cwd
                }
            ).output.toString()
        );
    }
};