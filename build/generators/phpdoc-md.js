"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const helpers_1 = require("../helpers");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const os_1 = require("os");
const GeneratorActionStepDefinition_1 = __importDefault(require("../GeneratorActionStepDefinition"));
const picomatch = require("picomatch");
class default_1 {
    /**
     * @inheritDoc
     */
    getComposerRequirements() {
        return ['clean/phpdoc-md'];
    }
    /**
     * @inheritDoc
     */
    checkIfAllInputOptionsDefined() {
        return (core_1.getInput('class_root_namespace').length > 0 &&
            core_1.getInput('include').length > 0);
    }
    /**
     * @inheritDoc
     */
    getAfterActions() {
        return [
            new GeneratorActionStepDefinition_1.default(null, 'Renaming README.md to Home.md...', fs_1.renameSync, core_1.getInput('temp_docs_folder').concat('/README.md'), core_1.getInput('temp_docs_folder').concat('/HOME.md'))
        ];
    }
    /**
     * @inheritDoc
     */
    getBeforeActions() {
        return [
            new GeneratorActionStepDefinition_1.default(this, 'Generating generator config...', this.generateConfig, process.cwd(), core_1.getInput('class_root_namespace'), core_1.getInput('include').split(os_1.EOL), core_1.getInput('temp_docs_folder'))
        ];
    }
    /**
     * @inheritDoc
     */
    generate() {
        helpers_1.execCommand('./vendor/bin/phpdoc-md', [], process.cwd());
    }
    /**
     * Generates PHPDocMD config
     *
     * @param string cwd
     * @param string rootNamespace Root namespace for documentation
     * @param string include      List of classes to include
     * @param string tempDocsPath Temporally docs folder where new documentation should be generated
     */
    generateConfig(cwd, rootNamespace, include, tempDocsPath) {
        helpers_1.execCommand('composer', ['install', '-a'], cwd);
        const classes = Object.keys(this.readComposerConfig()).filter(key => picomatch.isMatch(key, include));
        const config = {
            rootNamespace,
            destDirectory: tempDocsPath,
            format: 'github',
            classes
        };
        fs_1.writeFileSync(cwd.concat('/.phpdoc-md'), '<?php'.concat(os_1.EOL, 'return json_decode(', JSON.stringify(JSON.stringify(config)), ', false);'));
    }
    /**
     * Reads autoload classes from composer
     */
    readComposerConfig() {
        return JSON.parse(child_process_1.spawnSync('php', [
            '-r',
            'include_once "../vendor/autoload.php"; echo json_encode(include("./vendor/composer/autoload_classmap.php"));'
        ])
            .output.toString()
            .trim());
    }
}
exports.default = default_1;
