module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(325);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Composer_1 = __importDefault(__webpack_require__(963));
class SetConfigAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Doing local configuration...';
    }
    /**
     * @inheritDoc
     */
    shouldRun(generator) {
        return Object.keys(generator.getComposerConfig()).length > 0;
    }
    /**
     * @inheritDoc
     */
    exec(generator) {
        for (const [key, value] of Object.entries(generator.getComposerConfig())) {
            Composer_1.default.run(['config', key, value]);
        }
        Composer_1.default.run(['config', '-l']);
    }
}
exports.default = SetConfigAction;


/***/ }),

/***/ 14:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

/**
 * This defines list of generators by names that can be accessible from action configs
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_phpdoc_md_1 = __importDefault(__webpack_require__(714));
const evert_phpdoc_md_1 = __importDefault(__webpack_require__(679));
const generators = {
    'clean/phpdoc-md': new clean_phpdoc_md_1.default(),
    'phpdoc-md': new clean_phpdoc_md_1.default(),
    'evert/phpdoc-md': new evert_phpdoc_md_1.default()
};
exports.default = generators;


/***/ }),

/***/ 23:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class GenerateAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Generating documentation...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return true;
    }
    /**
     * @inheritDoc
     */
    exec(generator) {
        generator.generate();
    }
}
exports.default = GenerateAction;


/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 112:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
class ValidateMainParamsAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Validating main parameters...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return true;
    }
    /**
     * @inheritDoc
     */
    exec() {
        core_1.getInput('wiki_github_update_user', { required: true });
        if (core_1.getInput('wiki_github_update_token', {
            required: true
        }).length < 40) {
            throw new Error('wiki_github_update_token must have at least 40 characters');
        }
    }
}
exports.default = ValidateMainParamsAction;


/***/ }),

/***/ 115:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __webpack_require__(747);
const path_1 = __webpack_require__(622);
const TempPaths_1 = __importDefault(__webpack_require__(511));
const Composer_1 = __importDefault(__webpack_require__(963));
class BackupComposerFilesAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Backuping Composer files...';
    }
    /**
     * @inheritDoc
     */
    shouldRun(generator) {
        return (Object.keys(generator.getGlobalComposerRequirements()).length > 0 ||
            Object.keys(generator.getComposerRequirements()).length > 0);
    }
    /**
     * @inheritDoc
     */
    exec() {
        const globalPath = Composer_1.default.getGlobalPath();
        this.backupFile('composer.lock', 'composer-local-backup');
        this.backupFile(path_1.join(globalPath, 'composer.lock'), 'composer-global-backup');
        this.backupFile('composer.json', 'composer-local-backup');
        this.backupFile(path_1.join(globalPath, 'composer.json'), 'composer-global-backup');
        this.backupFile(path_1.join(globalPath, 'config.json'), 'composer-global-backup');
    }
    /**
     * Backups file
     *
     * @param string file File to backup
     * @param string dstType Destination temp path type
     */
    backupFile(file, dstType) {
        if (!fs_1.existsSync(file)) {
            return;
        }
        const fileName = path_1.basename(file);
        fs_1.copyFileSync(file, TempPaths_1.default.getFilename(dstType, fileName));
    }
}
exports.default = BackupComposerFilesAction;


/***/ }),

/***/ 117:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const child_process_1 = __webpack_require__(129);
const os_1 = __webpack_require__(87);
/**
 * Works with files executions
 */
class ExecutionHandler {
    /**
     * Replace Windows path separator with Unix
     *
     * @param string path Path to replace
     *
     * @return string
     */
    replaceWinPathCharToUnix(path) {
        return path.replace(/\\/g, '/');
    }
    /**
     * Executes command and prints to debug results
     *
     * @param string cmd  Command to be executed
     * @param Array<string> args Command arguments
     * @param string cwd Where to execute
     * @param object env Environment variables data
     */
    run(cmd, args, cwd, env = {}) {
        this.getResults(cmd, args, cwd, env);
    }
    /**
     * Prints running command
     *
     * @param string cmd  Command to be executed
     * @param Array<string> args Command arguments
     * @param string cwd Where to execute
     * @param object env Environment variables data
     */
    printRunningCommand(cmd, args, cwd, env) {
        const fullCommand = Object.entries(env)
            .map(([key, value]) => {
            let escVal = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            if (escVal.includes(' ') || escVal.includes('*')) {
                escVal = `"${escVal}"`;
            }
            return `${key}=${escVal}`;
        })
            .join(' ')
            .concat(' ', this.render(cmd, args));
        core_1.debug(` Executing ${fullCommand} in ${cwd}...`);
    }
    /**
     * Renders command
     *
     * @param string cmd Command to render
     * @param string[] args Command arguments
     */
    render(cmd, args = []) {
        return cmd
            .concat(' ', args.map(arg => this.escapeShellArg(arg)).join(' '))
            .trim();
    }
    /**
     * Prepares ENV options array
     *
     * @param object env Env data
     *
     * @return object
     */
    prepareEnvOptions(env) {
        return Object.assign({}, process.env, env);
    }
    /**
     * Escapes shell arg
     *
     * @param string arg Argument to escape
     *
     * @return string
     */
    escapeShellArg(arg) {
        let ret = '';
        ret = arg.replace(/[^\\]'/g, (m) => {
            return m.slice(0, 1).concat("\\'");
        });
        if (ret.includes(' ') || ret.includes('*')) {
            return `'${ret}'`;
        }
        return ret;
    }
    /**
     * Executes command and return result as string
     *
     * @param string cmd  Command to be executed
     * @param Array<string> args Command arguments
     * @param string cwd Where to execute
     * @param object env Environment variables data
     *
     * @return string
     */
    getResults(cmd, args, cwd, env = {}) {
        var _a;
        this.printRunningCommand(cmd, args, cwd, env);
        const envOptions = this.prepareEnvOptions(env);
        const proc = child_process_1.spawnSync(cmd, args, { cwd, env: envOptions });
        const out = (_a = proc.output) === null || _a === void 0 ? void 0 : _a.join('\n').trim().replace(/\n/g, os_1.EOL);
        for (const outputLine of out.split(os_1.EOL)) {
            core_1.debug(outputLine.trim());
        }
        if (proc.status === 0) {
            return out;
        }
        throw new Error(`Execution failed`);
    }
    /**
     * Is running on Windows?
     *
     * @return boolean
     */
    isRunningOnWindows() {
        return (process.platform.toString() === 'win32' ||
            process.platform.toString() === 'win64');
    }
    /**
     * Sufixes file extension if running on windows
     *
     * @param string filename Filename for witch add extension
     * @param string winExt Extension to add
     */
    suffixExtIfRunningOnWindows(filename, winExt = 'bat') {
        return this.isRunningOnWindows() ? filename.concat('.', winExt) : filename;
    }
}
exports.default = new ExecutionHandler();


/***/ }),

/***/ 120:
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747)
  , p = __webpack_require__(622)
  ;

function recursiveReaddirSync(path) {
  var list = []
    , files = fs.readdirSync(path)
    , stats
    ;

  files.forEach(function (file) {
    stats = fs.lstatSync(p.join(path, file));
    if(stats.isDirectory()) {
      list = list.concat(recursiveReaddirSync(p.join(path, file)));
    } else {
      list.push(p.join(path, file));
    }
  });

  return list;
}

module.exports = recursiveReaddirSync;


/***/ }),

/***/ 122:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GitInfo_1 = __importDefault(__webpack_require__(289));
const TempPaths_1 = __importDefault(__webpack_require__(511));
const Execution_1 = __importDefault(__webpack_require__(117));
class PushUpdateAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Pushing docs update...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return true;
    }
    /**
     * @inheritDoc
     */
    exec() {
        const cwd = TempPaths_1.default.get('new-docs-main');
        try {
            Execution_1.default.run('git', ['push', '-u', 'origin', GitInfo_1.default.branchOrTagName], cwd);
        }
        catch (e) {
            Execution_1.default.run('git', ['pull'], cwd);
            Execution_1.default.run('git', ['push', '.', GitInfo_1.default.branchOrTagName], cwd);
        }
    }
}
exports.default = PushUpdateAction;


/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 136:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Composer_1 = __importDefault(__webpack_require__(963));
class InstallAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Installing required composer packages...';
    }
    /**
     * @inheritDoc
     */
    shouldRun(generator) {
        return Object.keys(generator.getComposerRequirements()).length > 0;
    }
    /**
     * @inheritDoc
     */
    exec(generator) {
        const packages = Object.entries(generator.getComposerRequirements()).map(([key, value]) => `${key}=${value}`);
        Composer_1.default.run(['require', '--dev', '--no-progress', '--no-suggest'].concat(packages));
        Composer_1.default.run(['exec']);
    }
}
exports.default = InstallAction;


/***/ }),

/***/ 180:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const fs_1 = __webpack_require__(747);
const path_1 = __webpack_require__(622);
const TempPaths_1 = __importDefault(__webpack_require__(511));
const Execution_1 = __importDefault(__webpack_require__(117));
const readDirSync = __webpack_require__(120);
class FlattenFileStructureAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Flattering file structure...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return true;
    }
    /**
     * @inheritDoc
     */
    exec() {
        const newDocs = TempPaths_1.default.get('new-docs-workdir');
        const filenames = this.generateNewStructData(newDocs);
        const flippedFilenames = this.flipKeysWithValues(filenames);
        for (const newFilename in filenames) {
            const oldFilename = filenames[newFilename];
            if (oldFilename !== newFilename) {
                this.renameFile(newDocs, oldFilename, newFilename);
            }
        }
        for (const newFilename in filenames) {
            this.fixesToNewStyleLinks(newDocs.concat('/', newFilename), flippedFilenames);
        }
    }
    /**
     * Generate filenames data for new files structure
     *
     * @param string cwd Docs path
     */
    generateNewStructData(cwd) {
        const newStructData = {};
        const files = this.getAllFilesInfo(cwd);
        for (const fileInfo of this.filterFileInfoByShortPath(files, false)) {
            newStructData[fileInfo.filename] = fileInfo.filename;
        }
        for (const fileInfo of this.filterFileInfoByShortPath(files, true)) {
            let oldFilePath = fileInfo.shortPath.concat('/', fileInfo.filename);
            if (Execution_1.default.isRunningOnWindows()) {
                oldFilePath = oldFilePath.replace(/\\/g, '/');
            }
            if (oldFilePath.substr(0, 1) === '/') {
                oldFilePath = oldFilePath.substr(1);
            }
            if (typeof newStructData[fileInfo.filename] == 'undefined') {
                newStructData[fileInfo.filename] = oldFilePath;
            }
            else {
                newStructData[this.generateAltFilename(fileInfo)] = oldFilePath;
            }
        }
        return newStructData;
    }
    /**
     * Fixes links to new style
     *
     * @param string filename Filename where to fix links
     * @param object filenames Filenames data to fix
     */
    fixesToNewStyleLinks(filename, filenames) {
        core_1.debug(` Fixing ${filename}...`);
        const content = fs_1.readFileSync(filename, 'utf8');
        const allPossibleFilenames = {};
        for (const oldFilename in filenames) {
            const currentFilename = filenames[oldFilename];
            allPossibleFilenames[oldFilename] = currentFilename;
            const linFilename = oldFilename.replace(/\\/g, '/');
            allPossibleFilenames[linFilename] = currentFilename;
            if (path_1.extname(oldFilename) === '.md') {
                allPossibleFilenames[oldFilename.substr(0, oldFilename.length - 3)] = currentFilename;
            }
            if (path_1.extname(linFilename) === '.md') {
                allPossibleFilenames[linFilename.substr(0, linFilename.length - 3)] = currentFilename;
            }
            const winFilename = oldFilename.replace(/\//g, '\\');
            allPossibleFilenames[winFilename] = currentFilename;
            if (path_1.extname(winFilename) === '.md') {
                allPossibleFilenames[winFilename.substr(0, winFilename.length - 3)] = currentFilename;
            }
        }
        const newContent = content.replace(/\[([^\]]+)]\(([^\)]+)\)/gm, (fullMsg, name, link) => {
            if (typeof allPossibleFilenames[link] !== 'undefined') {
                const jstr = allPossibleFilenames[link]
                    .split('.')
                    .slice(0, -1)
                    .join('.');
                return `[${name}](${jstr})`;
            }
            return fullMsg;
        });
        if (newContent !== content) {
            core_1.debug('  Changed.');
            fs_1.writeFileSync(filename, newContent);
        }
    }
    /**
     * Flip keys with values for object
     *
     * @param object obj Object to flip
     */
    flipKeysWithValues(obj) {
        const ret = {};
        for (const x in obj) {
            ret[obj[x]] = x;
        }
        return ret;
    }
    /**
     * Gets all files info in path
     *
     * @param string cwd Path where to get files info
     */
    getAllFilesInfo(cwd) {
        return readDirSync(cwd).map((file) => {
            const shortFilename = path_1.basename(file);
            const pathWithoutFilename = path_1.dirname(file);
            const pathPrefix = pathWithoutFilename.substr(cwd.length);
            return {
                filename: shortFilename,
                shortPath: pathPrefix
            };
        });
    }
    /**
     * Renames file
     *
     * @param string newDocs New docs
     * @param string oldFilename Old filename
     * @param string newFilename New filename
     */
    renameFile(newDocs, oldFilename, newFilename) {
        core_1.debug(` Renaming ${oldFilename} -> ${newFilename}...`);
        fs_1.renameSync(newDocs.concat('/', oldFilename), newDocs.concat('/', newFilename));
    }
    /**
     * Filters file infos by short path
     *
     * @param object[] files Files to filter
     * @param boolean withShortPath Should have anything in short path
     */
    filterFileInfoByShortPath(files, withShortPath) {
        return files.filter((fileInfo) => {
            return withShortPath
                ? fileInfo.shortPath !== ''
                : fileInfo.shortPath === '';
        });
    }
    /**
     * Generates alternative filename
     *
     * @param object fileInfo Fileinfo from where to generate new filename
     */
    generateAltFilename(fileInfo) {
        const filenameWithoutExt = fileInfo.filename
            .split('.')
            .slice(0, -1)
            .join('.');
        const ext = path_1.extname(fileInfo.filename);
        let namespaceName = fileInfo.shortPath.replace(/\//g, '⁄');
        if (namespaceName.substr(0, 1) === '⁄') {
            namespaceName = namespaceName.substr(1);
        }
        return `${filenameWithoutExt} (${namespaceName})${ext}`;
    }
}
exports.default = FlattenFileStructureAction;


/***/ }),

/***/ 186:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const fs_1 = __webpack_require__(747);
const path_1 = __webpack_require__(622);
const GitInfo_1 = __importDefault(__webpack_require__(289));
const TempPaths_1 = __importDefault(__webpack_require__(511));
const Execution_1 = __importDefault(__webpack_require__(117));
class CloneWikiAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Cloning old wiki...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return true;
    }
    /**
     * @inheritDoc
     */
    exec() {
        const oldDocsDir = this.getOldDocsPath();
        if (fs_1.existsSync(oldDocsDir)) {
            throw new Error(oldDocsDir.concat(" already exists but shouldn't"));
        }
        fs_1.mkdirSync(oldDocsDir);
        Execution_1.default.run('git', [
            'clone',
            `https://${this.getUpdateUser()}:${this.getUpdateToken()}@github.com/${GitInfo_1.default.getCurrentRepositoryName()}.wiki.git`,
            path_1.basename(oldDocsDir)
        ], path_1.dirname(oldDocsDir));
        Execution_1.default.run('git', ['config', '--local', 'gc.auto', '0'], oldDocsDir);
        Execution_1.default.run('git', ['branch', '-r'], oldDocsDir);
        if (this.branchExist(GitInfo_1.default.branchOrTagName, oldDocsDir)) {
            Execution_1.default.run('git', ['checkout', GitInfo_1.default.branchOrTagName], oldDocsDir);
            Execution_1.default.run('git', ['pull'], oldDocsDir);
        }
        else {
            Execution_1.default.run('git', ['checkout', '-b', GitInfo_1.default.branchOrTagName], oldDocsDir);
        }
    }
    /**
     * Checks if branch exist
     *
     * @param string branch Branch to check
     * @param string oldDocsDir Where to check
     *
     * @return boolean
     */
    branchExist(branch, oldDocsDir) {
        try {
            Execution_1.default.run('git', ['show-branch', `origin/${branch}`], oldDocsDir);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    /**
     * Gets GitHub token that will be used for update action
     */
    getUpdateToken() {
        return core_1.getInput('wiki_github_update_token', { required: true });
    }
    /**
     * Get GitHub user for witch token belongs
     */
    getUpdateUser() {
        return core_1.getInput('wiki_github_update_user', { required: true });
    }
    /**
     * Get old docs path
     */
    getOldDocsPath() {
        return TempPaths_1.default.get('old-docs-main');
    }
}
exports.default = CloneWikiAction;


/***/ }),

/***/ 199:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const WIN_SLASH = '\\\\/';
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

/**
 * Posix glob regex
 */

const DOT_LITERAL = '\\.';
const PLUS_LITERAL = '\\+';
const QMARK_LITERAL = '\\?';
const SLASH_LITERAL = '\\/';
const ONE_CHAR = '(?=.)';
const QMARK = '[^/]';
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR = `${QMARK}*?`;

const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR,
  START_ANCHOR
};

/**
 * Windows glob regex
 */

const WINDOWS_CHARS = {
  ...POSIX_CHARS,

  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
};

/**
 * POSIX Bracket Regex
 */

const POSIX_REGEX_SOURCE = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

module.exports = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE,

  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    '***': '*',
    '**/**': '**',
    '**/**/**': '**'
  },

  // Digits
  CHAR_0: 48, /* 0 */
  CHAR_9: 57, /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 65, /* A */
  CHAR_LOWERCASE_A: 97, /* a */
  CHAR_UPPERCASE_Z: 90, /* Z */
  CHAR_LOWERCASE_Z: 122, /* z */

  CHAR_LEFT_PARENTHESES: 40, /* ( */
  CHAR_RIGHT_PARENTHESES: 41, /* ) */

  CHAR_ASTERISK: 42, /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38, /* & */
  CHAR_AT: 64, /* @ */
  CHAR_BACKWARD_SLASH: 92, /* \ */
  CHAR_CARRIAGE_RETURN: 13, /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
  CHAR_COLON: 58, /* : */
  CHAR_COMMA: 44, /* , */
  CHAR_DOT: 46, /* . */
  CHAR_DOUBLE_QUOTE: 34, /* " */
  CHAR_EQUAL: 61, /* = */
  CHAR_EXCLAMATION_MARK: 33, /* ! */
  CHAR_FORM_FEED: 12, /* \f */
  CHAR_FORWARD_SLASH: 47, /* / */
  CHAR_GRAVE_ACCENT: 96, /* ` */
  CHAR_HASH: 35, /* # */
  CHAR_HYPHEN_MINUS: 45, /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
  CHAR_LEFT_CURLY_BRACE: 123, /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
  CHAR_LINE_FEED: 10, /* \n */
  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
  CHAR_PERCENT: 37, /* % */
  CHAR_PLUS: 43, /* + */
  CHAR_QUESTION_MARK: 63, /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
  CHAR_SEMICOLON: 59, /* ; */
  CHAR_SINGLE_QUOTE: 39, /* ' */
  CHAR_SPACE: 32, /*   */
  CHAR_TAB: 9, /* \t */
  CHAR_UNDERSCORE: 95, /* _ */
  CHAR_VERTICAL_LINE: 124, /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

  SEP: path.sep,

  /**
   * Create EXTGLOB_CHARS
   */

  extglobChars(chars) {
    return {
      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
      '?': { type: 'qmark', open: '(?:', close: ')?' },
      '+': { type: 'plus', open: '(?:', close: ')+' },
      '*': { type: 'star', open: '(?:', close: ')*' },
      '@': { type: 'at', open: '(?:', close: ')' }
    };
  },

  /**
   * Create GLOB_CHARS
   */

  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};


/***/ }),

/***/ 245:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Composer_1 = __importDefault(__webpack_require__(963));
class GlobalSetConfigAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Doing global configuration...';
    }
    /**
     * @inheritDoc
     */
    shouldRun(generator) {
        return Object.keys(generator.getGlobalComposerConfig()).length > 0;
    }
    /**
     * @inheritDoc
     */
    exec(generator) {
        for (const [key, value] of Object.entries(generator.getGlobalComposerConfig())) {
            Composer_1.default.run(['global', 'config', key, value]);
        }
        Composer_1.default.run(['global', 'config', '-l']);
    }
}
exports.default = GlobalSetConfigAction;


/***/ }),

/***/ 265:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const win32 = process.platform === 'win32';
const {
  REGEX_BACKSLASH,
  REGEX_REMOVE_BACKSLASH,
  REGEX_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_GLOBAL
} = __webpack_require__(199);

exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
exports.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

exports.removeBackslashes = str => {
  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
    return match === '\\' ? '' : match;
  });
};

exports.supportsLookbehinds = () => {
  const segs = process.version.slice(1).split('.').map(Number);
  if (segs.length === 3 && segs[0] >= 9 || (segs[0] === 8 && segs[1] >= 10)) {
    return true;
  }
  return false;
};

exports.isWindows = options => {
  if (options && typeof options.windows === 'boolean') {
    return options.windows;
  }
  return win32 === true || path.sep === '\\';
};

exports.escapeLast = (input, char, lastIdx) => {
  const idx = input.lastIndexOf(char, lastIdx);
  if (idx === -1) return input;
  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
  return `${input.slice(0, idx)}\\${input.slice(idx)}`;
};

exports.removePrefix = (input, state = {}) => {
  let output = input;
  if (output.startsWith('./')) {
    output = output.slice(2);
    state.prefix = './';
  }
  return output;
};

exports.wrapOutput = (input, state = {}, options = {}) => {
  const prepend = options.contains ? '' : '^';
  const append = options.contains ? '' : '$';

  let output = `${prepend}(?:${input})${append}`;
  if (state.negated === true) {
    output = `(?:^(?!${output}).*$)`;
  }
  return output;
};


/***/ }),

/***/ 269:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This file defines Actions list in correct order
 */
const install_1 = __importDefault(__webpack_require__(136));
const clone_wiki_1 = __importDefault(__webpack_require__(186));
const exec_before_generator_Actions_1 = __importDefault(__webpack_require__(687));
const generate_1 = __importDefault(__webpack_require__(23));
const exec_after_generator_Actions_1 = __importDefault(__webpack_require__(336));
const flatten_file_structure_1 = __importDefault(__webpack_require__(180));
const prefix_1 = __importDefault(__webpack_require__(850));
const copy_old_git_data_to_new_place_1 = __importDefault(__webpack_require__(981));
const configure_commit_author_1 = __importDefault(__webpack_require__(476));
const check_status_1 = __importDefault(__webpack_require__(484));
const commit_1 = __importDefault(__webpack_require__(534));
const push_update_1 = __importDefault(__webpack_require__(122));
const uninstall_1 = __importDefault(__webpack_require__(481));
const remove_not_required_files_1 = __importDefault(__webpack_require__(771));
const global_install_1 = __importDefault(__webpack_require__(450));
const global_uninstall_1 = __importDefault(__webpack_require__(533));
const global_set_config_1 = __importDefault(__webpack_require__(245));
const set_config_1 = __importDefault(__webpack_require__(1));
const backup_composer_files_action_1 = __importDefault(__webpack_require__(115));
const restore_composer_files_1 = __importDefault(__webpack_require__(920));
const init_tmp_paths_1 = __importDefault(__webpack_require__(854));
const validate_main_params_1 = __importDefault(__webpack_require__(112));
const actions = [
    new validate_main_params_1.default(),
    new init_tmp_paths_1.default(),
    new backup_composer_files_action_1.default(),
    new global_set_config_1.default(),
    new global_install_1.default(),
    new set_config_1.default(),
    new install_1.default(),
    new clone_wiki_1.default(),
    new exec_before_generator_Actions_1.default(),
    new generate_1.default(),
    new exec_after_generator_Actions_1.default(),
    new flatten_file_structure_1.default(),
    new prefix_1.default(),
    new copy_old_git_data_to_new_place_1.default(),
    new configure_commit_author_1.default(),
    new check_status_1.default(),
    new commit_1.default(),
    new push_update_1.default(),
    new restore_composer_files_1.default(),
    new uninstall_1.default(),
    new global_uninstall_1.default(),
    new remove_not_required_files_1.default()
];
exports.default = actions;


/***/ }),

/***/ 279:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
/**
 * Class to define generator action step
 */
class GeneratorActionStepDefinition {
    /**
     * Constructor
     *
     * @param object|null generator Linked generator
     * @param string description Description to print for step
     * @param Function execCallback Callback that will be executed for action
     * @param args any extra args
     */
    constructor(generator, description, execCallback, ...args) {
        this.description = description;
        this.execCallback = execCallback;
        this.args = args;
        this.generator = generator;
    }
    /**
     * Executes action
     */
    exec() {
        core_1.info(this.description);
        this.execCallback.apply(this.generator, this.args);
    }
}
exports.default = GeneratorActionStepDefinition;


/***/ }),

/***/ 289:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Execution_1 = __importDefault(__webpack_require__(117));
class GitInfoHandler {
    /**
     * Constructor
     */
    constructor(cwd) {
        this.cwd = cwd;
        this.lastCommitEmail = this.execGitShowCommand('%ae');
        this.lastCommitAuthor = this.execGitShowCommand('%an');
        const branch = Execution_1.default.getResults('git', ['rev-parse', '--abbrev-ref', 'HEAD'], this.cwd);
        if (branch === 'HEAD') {
            this.isTag = true;
            this.branchOrTagName = Execution_1.default.getResults('git', ['describe', '--tags', '--abbrev=0'], this.cwd);
        }
        else {
            this.branchOrTagName = branch;
            this.isTag = false;
        }
    }
    /**
     * Gets current repository name
     */
    getCurrentRepositoryName() {
        return typeof process.env['GITHUB_REPOSITORY'] == 'undefined'
            ? ''
            : process.env['GITHUB_REPOSITORY'];
    }
    /**
     * Get last commit SHA hash from last main branch commit
     */
    getCurrentLastCommitSHA() {
        return typeof process.env['GITHUB_SHA'] == 'undefined'
            ? ''
            : process.env['GITHUB_SHA'];
    }
    /**
     * Execute git show command and returns output
     *
     * @param string format What return as git show command format
     */
    execGitShowCommand(format) {
        return Execution_1.default.getResults('git', ['show', '-s', `--format='${format}'`, 'HEAD'], this.cwd);
    }
}
exports.default = new GitInfoHandler(process.cwd());


/***/ }),

/***/ 325:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const actions_1 = __importDefault(__webpack_require__(269));
const generators_1 = __importDefault(__webpack_require__(14));
try {
    const generatorName = core_1.getInput('engine', { required: false });
    if (typeof generators_1.default[generatorName] == 'undefined') {
        throw new Error('Unknown selected generator name');
    }
    const generator = generators_1.default[generatorName];
    if (!generator.checkIfAllInputOptionsDefined()) {
        throw new TypeError('Not all required arguments defined for selected engine');
    }
    for (const action of actions_1.default) {
        if (!action.shouldRun(generator)) {
            continue;
        }
        const desc = action.getDescription();
        if (desc !== null) {
            core_1.info(desc);
        }
        action.exec(generator);
    }
}
catch (err) {
    for (const line of err.stack.split('\n')) {
        core_1.error(line);
    }
    core_1.setFailed(err.message);
}


/***/ }),

/***/ 336:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ExecAfterGeneratorActionsAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return null;
    }
    /**
     * @inheritDoc
     */
    shouldRun(generator) {
        return generator.getAfterActions().length > 0;
    }
    /**
     * @inheritDoc
     */
    exec(generator) {
        for (const definition of generator.getAfterActions()) {
            definition.exec();
        }
    }
}
exports.default = ExecAfterGeneratorActionsAction;


/***/ }),

/***/ 366:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const scan = __webpack_require__(537);
const parse = __webpack_require__(806);
const utils = __webpack_require__(265);
const constants = __webpack_require__(199);
const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @name picomatch
 * @param {String|Array} `globs` One or more glob patterns.
 * @param {Object=} `options`
 * @return {Function=} Returns a matcher function.
 * @api public
 */

const picomatch = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    const fns = glob.map(input => picomatch(input, options, returnState));
    const arrayMatcher = str => {
      for (const isMatch of fns) {
        const state = isMatch(str);
        if (state) return state;
      }
      return false;
    };
    return arrayMatcher;
  }

  const isState = isObject(glob) && glob.tokens && glob.input;

  if (glob === '' || (typeof glob !== 'string' && !isState)) {
    throw new TypeError('Expected pattern to be a non-empty string');
  }

  const opts = options || {};
  const posix = utils.isWindows(options);
  const regex = isState
    ? picomatch.compileRe(glob, options)
    : picomatch.makeRe(glob, options, false, true);

  const state = regex.state;
  delete regex.state;

  let isIgnored = () => false;
  if (opts.ignore) {
    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
  }

  const matcher = (input, returnObject = false) => {
    const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output, match, isMatch };

    if (typeof opts.onResult === 'function') {
      opts.onResult(result);
    }

    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (isIgnored(input)) {
      if (typeof opts.onIgnore === 'function') {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (typeof opts.onMatch === 'function') {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };

  if (returnState) {
    matcher.state = state;
  }

  return matcher;
};

/**
 * Test `input` with the given `regex`. This is used by the main
 * `picomatch()` function to test the input string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.test(input, regex[, options]);
 *
 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp} `regex`
 * @return {Object} Returns an object with matching info.
 * @api public
 */

picomatch.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (input === '') {
    return { isMatch: false, output: '' };
  }

  const opts = options || {};
  const format = opts.format || (posix ? utils.toPosixSlashes : null);
  let match = input === glob;
  let output = (match && format) ? format(input) : input;

  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }

  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }

  return { isMatch: Boolean(match), match, output };
};

/**
 * Match the basename of a filepath.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.matchBase(input, glob[, options]);
 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
 * @return {Boolean}
 * @api public
 */

picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
  const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
  return regex.test(path.basename(input));
};

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.isMatch(string, patterns[, options]);
 *
 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String|Array} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const result = picomatch.parse(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
 * @api public
 */

picomatch.parse = (pattern, options) => {
  if (Array.isArray(pattern)) return pattern.map(p => picomatch.parse(p, options));
  return parse(pattern, { ...options, fastpaths: false });
};

/**
 * Scan a glob pattern to separate the pattern into segments.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.scan(input[, options]);
 *
 * const result = picomatch.scan('!./foo/*.js');
 * console.log(result);
 * { prefix: '!./',
 *   input: '!./foo/*.js',
 *   start: 3,
 *   base: 'foo',
 *   glob: '*.js',
 *   isBrace: false,
 *   isBracket: false,
 *   isGlob: true,
 *   isExtglob: false,
 *   isGlobstar: false,
 *   negated: true }
 * ```
 * @param {String} `input` Glob pattern to scan.
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

picomatch.scan = (input, options) => scan(input, options);

/**
 * Create a regular expression from a glob pattern.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.makeRe(input[, options]);
 *
 * console.log(picomatch.makeRe('*.js'));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `input` A glob pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

picomatch.compileRe = (parsed, options, returnOutput = false, returnState = false) => {
  if (returnOutput === true) {
    return parsed.output;
  }

  const opts = options || {};
  const prepend = opts.contains ? '' : '^';
  const append = opts.contains ? '' : '$';

  let source = `${prepend}(?:${parsed.output})${append}`;
  if (parsed && parsed.negated === true) {
    source = `^(?!${source}).*$`;
  }

  const regex = picomatch.toRegex(source, options);
  if (returnState === true) {
    regex.state = parsed;
  }

  return regex;
};

picomatch.makeRe = (input, options, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== 'string') {
    throw new TypeError('Expected a non-empty string');
  }

  const opts = options || {};
  let parsed = { negated: false, fastpaths: true };
  let prefix = '';
  let output;

  if (input.startsWith('./')) {
    input = input.slice(2);
    prefix = parsed.prefix = './';
  }

  if (opts.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
    output = parse.fastpaths(input, options);
  }

  if (output === undefined) {
    parsed = parse(input, options);
    parsed.prefix = prefix + (parsed.prefix || '');
  } else {
    parsed.output = output;
  }

  return picomatch.compileRe(parsed, options, returnOutput, returnState);
};

/**
 * Create a regular expression from the given regex source string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.toRegex(source[, options]);
 *
 * const { output } = picomatch.parse('*.js');
 * console.log(picomatch.toRegex(output));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `source` Regular expression source string.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

picomatch.toRegex = (source, options) => {
  try {
    const opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
  } catch (err) {
    if (options && options.debug === true) throw err;
    return /$^/;
  }
};

/**
 * Picomatch constants.
 * @return {Object}
 */

picomatch.constants = constants;

/**
 * Expose "picomatch"
 */

module.exports = picomatch;


/***/ }),

/***/ 417:
/***/ (function(module) {

module.exports = require("crypto");

/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return (s || '')
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return (s || '')
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 450:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Composer_1 = __importDefault(__webpack_require__(963));
class GlobalInstallAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Installing global required composer packages...';
    }
    /**
     * @inheritDoc
     */
    shouldRun(generator) {
        return Object.keys(generator.getGlobalComposerRequirements()).length > 0;
    }
    /**
     * @inheritDoc
     */
    exec(generator) {
        const packages = Object.entries(generator.getGlobalComposerRequirements()).map(([key, value]) => `${key}=${value}`);
        Composer_1.default.run(['global', 'require', '--dev', '--no-progress', '--no-suggest'].concat(packages));
        Composer_1.default.run(['global', 'exec']);
    }
}
exports.default = GlobalInstallAction;


/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command_1.issueCommand('set-env', { name }, val);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store
 */
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message
 */
function error(message) {
    command_1.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command_1.issue('warning', message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store
 */
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 476:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GitInfo_1 = __importDefault(__webpack_require__(289));
const TempPaths_1 = __importDefault(__webpack_require__(511));
const Execution_1 = __importDefault(__webpack_require__(117));
class ConfigureCommitAuthorAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Configure WIKI commit author...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return true;
    }
    /**
     * @inheritDoc
     */
    exec() {
        const cwd = TempPaths_1.default.get('new-docs-main');
        Execution_1.default.run('git', ['config', '--local', 'user.email', GitInfo_1.default.lastCommitEmail], cwd);
        Execution_1.default.run('git', ['config', '--local', 'user.name', GitInfo_1.default.lastCommitAuthor], cwd);
    }
}
exports.default = ConfigureCommitAuthorAction;


/***/ }),

/***/ 481:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Composer_1 = __importDefault(__webpack_require__(963));
class UninstallAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Uninstalling required composer packages...';
    }
    /**
     * @inheritDoc
     */
    shouldRun(generator) {
        return Object.keys(generator.getComposerRequirements()).length > 0;
    }
    /**
     * @inheritDoc
     */
    exec() {
        Composer_1.default.run(['install', '--no-progress', '--no-suggest']);
    }
}
exports.default = UninstallAction;


/***/ }),

/***/ 484:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TempPaths_1 = __importDefault(__webpack_require__(511));
const Execution_1 = __importDefault(__webpack_require__(117));
class CheckStatusAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Configure git changes status...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return true;
    }
    /**
     * @inheritDoc
     */
    exec() {
        Execution_1.default.run('git', ['status'], TempPaths_1.default.get('new-docs-main'));
    }
}
exports.default = CheckStatusAction;


/***/ }),

/***/ 511:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __webpack_require__(87);
const crypto_1 = __webpack_require__(417);
const fs_1 = __webpack_require__(747);
const path_1 = __webpack_require__(622);
const core_1 = __webpack_require__(470);
/**
 * Deals with temp paths
 */
class TempPathsHandler {
    constructor() {
        /**
         * Stores paths
         */
        this.paths = {};
    }
    /**
     * Checks if such path is already added
     *
     * @param string type Path type
     *
     * @return boolean
     */
    isSet(type) {
        return typeof this.paths[type] !== 'undefined';
    }
    /**
     * Generates new path in array
     *
     * @param string type Path short name (aka type)
     * @param boolean create Do we need automatically to create path?
     */
    add(type, create = true) {
        if (this.isSet(type)) {
            throw new Error(`${type} path is already added`);
        }
        this.paths[type] = this.generateUniqueTmpDirPath(type);
        if (create) {
            fs_1.mkdirSync(this.paths[type]);
        }
    }
    /**
     * Generates unique temp dir path
     *
     * @param string type Path type
     *
     * @return string
     */
    generateUniqueTmpDirPath(type) {
        let path;
        const tmpPathBase = os_1.tmpdir();
        const hash = crypto_1.createHash('sha1');
        while (fs_1.existsSync((path = path_1.join(tmpPathBase, type.concat('-', hash.update(Date.now().toString()).digest('hex'))))))
            ;
        return path;
    }
    /**
     * Gets path by type
     *
     * @param string type Path type
     */
    get(type) {
        if (!this.isSet(type)) {
            throw new Error(`${type} path is not yet added`);
        }
        return this.paths[type];
    }
    /**
     * Prints debug info
     */
    debug() {
        core_1.debug(`Registered paths:`);
        for (const type in this.paths) {
            core_1.debug(`  ${type} = ${this.paths[type]}`);
        }
    }
    /**
     * Adds subpath as alias
     *
     * @param string type New type
     * @param string originalType Original type
     * @param string path Sub path
     */
    addSubpathAlias(type, originalType, path) {
        if (this.isSet(type)) {
            throw new Error(`${type} path is already added`);
        }
        if (!this.isSet(originalType)) {
            throw new Error(`${originalType} path is not yet added`);
        }
        this.paths[type] = path_1.join(this.get(originalType), path);
    }
    /**
     * Get all entries
     *
     * @return array
     */
    getEntries() {
        return Object.entries(this.paths);
    }
    /**
     * Gets all registered paths
     *
     * @return string[]
     */
    getAllPaths() {
        return Object.values(this.paths);
    }
    /**
     * Get filename for type
     *
     * @param string type Type of path
     * @param string relativePath Filename to get (relative)
     *
     * @return string
     */
    getFilename(type, relativePath) {
        return path_1.join(this.get(type), relativePath);
    }
}
exports.default = new TempPathsHandler();


/***/ }),

/***/ 533:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Composer_1 = __importDefault(__webpack_require__(963));
class GlobalUninstallAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Uninstalling global required composer packages...';
    }
    /**
     * @inheritDoc
     */
    shouldRun(generator) {
        return Object.keys(generator.getGlobalComposerRequirements()).length > 0;
    }
    /**
     * @inheritDoc
     */
    exec() {
        Composer_1.default.run(['global', 'install', '--dev', '--no-progress']);
    }
}
exports.default = GlobalUninstallAction;


/***/ }),

/***/ 534:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const GitInfo_1 = __importDefault(__webpack_require__(289));
const TempPaths_1 = __importDefault(__webpack_require__(511));
const Execution_1 = __importDefault(__webpack_require__(117));
class CommitAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Committing docs update...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return true;
    }
    /**
     * @inheritDoc
     */
    exec() {
        const cwd = TempPaths_1.default.get('new-docs-main');
        Execution_1.default.run('git', ['add', '-u', ':/'], cwd);
        Execution_1.default.run('git', ['add', '.'], cwd);
        try {
            Execution_1.default.run('git', [
                'commit',
                '-m',
                `Automatically generated for https://github.com/${GitInfo_1.default.getCurrentRepositoryName()}/commit/${GitInfo_1.default.getCurrentLastCommitSHA()}`
            ], cwd);
        }
        catch (e) {
            core_1.debug('Nothing to commit');
        }
    }
}
exports.default = CommitAction;


/***/ }),

/***/ 537:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(265);
const {
  CHAR_ASTERISK,             /* * */
  CHAR_AT,                   /* @ */
  CHAR_BACKWARD_SLASH,       /* \ */
  CHAR_COMMA,                /* , */
  CHAR_DOT,                  /* . */
  CHAR_EXCLAMATION_MARK,     /* ! */
  CHAR_FORWARD_SLASH,        /* / */
  CHAR_LEFT_CURLY_BRACE,     /* { */
  CHAR_LEFT_PARENTHESES,     /* ( */
  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
  CHAR_PLUS,                 /* + */
  CHAR_QUESTION_MARK,        /* ? */
  CHAR_RIGHT_CURLY_BRACE,    /* } */
  CHAR_RIGHT_PARENTHESES,    /* ) */
  CHAR_RIGHT_SQUARE_BRACKET  /* ] */
} = __webpack_require__(199);

const isPathSeparator = code => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};

const depth = token => {
  if (token.isPrefix !== true) {
    token.depth = token.isGlobstar ? Infinity : 1;
  }
};

/**
 * Quickly scans a glob pattern and returns an object with a handful of
 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
 * `glob` (the actual pattern), and `negated` (true if the path starts with `!`).
 *
 * ```js
 * const pm = require('picomatch');
 * console.log(pm.scan('foo/bar/*.js'));
 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an object with tokens and regex source string.
 * @api public
 */

const scan = (input, options) => {
  const opts = options || {};

  const length = input.length - 1;
  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
  const slashes = [];
  const tokens = [];
  const parts = [];

  let str = input;
  let index = -1;
  let start = 0;
  let lastIndex = 0;
  let isBrace = false;
  let isBracket = false;
  let isGlob = false;
  let isExtglob = false;
  let isGlobstar = false;
  let braceEscaped = false;
  let backslashes = false;
  let negated = false;
  let finished = false;
  let braces = 0;
  let prev;
  let code;
  let token = { value: '', depth: 0, isGlob: false };

  const eos = () => index >= length;
  const peek = () => str.charCodeAt(index + 1);
  const advance = () => {
    prev = code;
    return str.charCodeAt(++index);
  };

  while (index < length) {
    code = advance();
    let next;

    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = token.backslashes = true;
      code = advance();

      if (code === CHAR_LEFT_CURLY_BRACE) {
        braceEscaped = true;
      }
      continue;
    }

    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
      braces++;

      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          continue;
        }

        if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (braceEscaped !== true && code === CHAR_COMMA) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (code === CHAR_RIGHT_CURLY_BRACE) {
          braces--;

          if (braces === 0) {
            braceEscaped = false;
            isBrace = token.isBrace = true;
            finished = true;
            break;
          }
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (code === CHAR_FORWARD_SLASH) {
      slashes.push(index);
      tokens.push(token);
      token = { value: '', depth: 0, isGlob: false };

      if (finished === true) continue;
      if (prev === CHAR_DOT && index === (start + 1)) {
        start += 2;
        continue;
      }

      lastIndex = index + 1;
      continue;
    }

    if (opts.noext !== true) {
      const isExtglobChar = code === CHAR_PLUS
        || code === CHAR_AT
        || code === CHAR_ASTERISK
        || code === CHAR_QUESTION_MARK
        || code === CHAR_EXCLAMATION_MARK;

      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
        isGlob = token.isGlob = true;
        isExtglob = token.isExtglob = true;
        finished = true;

        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }

            if (code === CHAR_RIGHT_PARENTHESES) {
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
    }

    if (code === CHAR_ASTERISK) {
      if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_QUESTION_MARK) {
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_LEFT_SQUARE_BRACKET) {
      while (eos() !== true && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          isBracket = token.isBracket = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
    }

    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = token.negated = true;
      start++;
      continue;
    }

    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          code = advance();
          continue;
        }

        if (code === CHAR_RIGHT_PARENTHESES) {
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
    }

    if (isGlob === true) {
      finished = true;

      if (scanToEnd === true) {
        continue;
      }

      break;
    }
  }

  if (opts.noext === true) {
    isExtglob = false;
    isGlob = false;
  }

  let base = str;
  let prefix = '';
  let glob = '';

  if (start > 0) {
    prefix = str.slice(0, start);
    str = str.slice(start);
    lastIndex -= start;
  }

  if (base && isGlob === true && lastIndex > 0) {
    base = str.slice(0, lastIndex);
    glob = str.slice(lastIndex);
  } else if (isGlob === true) {
    base = '';
    glob = str;
  } else {
    base = str;
  }

  if (base && base !== '' && base !== '/' && base !== str) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }

  if (opts.unescape === true) {
    if (glob) glob = utils.removeBackslashes(glob);

    if (base && backslashes === true) {
      base = utils.removeBackslashes(base);
    }
  }

  const state = {
    prefix,
    input,
    start,
    base,
    glob,
    isBrace,
    isBracket,
    isGlob,
    isExtglob,
    isGlobstar,
    negated
  };

  if (opts.tokens === true) {
    state.maxDepth = 0;
    if (!isPathSeparator(code)) {
      tokens.push(token);
    }
    state.tokens = tokens;
  }

  if (opts.parts === true || opts.tokens === true) {
    let prevIndex;

    for (let idx = 0; idx < slashes.length; idx++) {
      const n = prevIndex ? prevIndex + 1 : start;
      const i = slashes[idx];
      const value = input.slice(n, i);
      if (opts.tokens) {
        if (idx === 0 && start !== 0) {
          tokens[idx].isPrefix = true;
          tokens[idx].value = prefix;
        } else {
          tokens[idx].value = value;
        }
        depth(tokens[idx]);
        state.maxDepth += tokens[idx].depth;
      }
      if (idx !== 0 || value !== '') {
        parts.push(value);
      }
      prevIndex = i;
    }

    if (prevIndex && prevIndex + 1 < input.length) {
      const value = input.slice(prevIndex + 1);
      parts.push(value);

      if (opts.tokens) {
        tokens[tokens.length - 1].value = value;
        depth(tokens[tokens.length - 1]);
        state.maxDepth += tokens[tokens.length - 1].depth;
      }
    }

    state.slashes = slashes;
    state.parts = parts;
  }

  return state;
};

module.exports = scan;


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 679:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GeneratorActionStepDefinition_1 = __importDefault(__webpack_require__(279));
const core_1 = __webpack_require__(470);
const fs_1 = __webpack_require__(747);
const path_1 = __webpack_require__(622);
const TempPaths_1 = __importDefault(__webpack_require__(511));
const Execution_1 = __importDefault(__webpack_require__(117));
const Composer_1 = __importDefault(__webpack_require__(963));
class default_1 {
    /**
     * @inheritDoc
     */
    getNeededTemporalPathPlaces() {
        return ['xml', 'cache'];
    }
    /**
     * @inheritDoc
     */
    getComposerConfig() {
        return {};
    }
    /**
     * @inheritDoc
     */
    getGlobalComposerConfig() {
        return {
            'minimum-stability': 'dev',
            'prefer-stable': 'true'
        };
    }
    /**
     * @inheritDoc
     */
    getGlobalComposerRequirements() {
        return {
            'phpdocumentor/phpdocumentor': '3.*',
            //'symfony/process': '~2.0',
            'evert/phpdoc-md': '~0.2.0'
        };
    }
    /**
     * @inheritDoc
     */
    getComposerRequirements() {
        return {};
    }
    /**
     * @inheritDoc
     */
    checkIfAllInputOptionsDefined() {
        return true;
    }
    /**
     * @inheritDoc
     */
    getAfterActions() {
        return [
            new GeneratorActionStepDefinition_1.default(null, 'Renaming ApiIndex.md to Home.md...', fs_1.renameSync, TempPaths_1.default.getFilename('new-docs-workdir', 'ApiIndex.md'), TempPaths_1.default.getFilename('new-docs-workdir', 'HOME.md'))
        ];
    }
    /**
     * @inheritDoc
     */
    getBeforeActions() {
        return [
            new GeneratorActionStepDefinition_1.default(Composer_1.default, 'Removing dev requirements...', Composer_1.default.removeDevRequirements),
            new GeneratorActionStepDefinition_1.default(this, 'Generating XML data...', this.generateXML, TempPaths_1.default.get('xml'), TempPaths_1.default.get('cache')),
            new GeneratorActionStepDefinition_1.default(Composer_1.default, 'Install dev requirements...', Composer_1.default.installDevRequirements)
        ];
    }
    /**
     * @inheritDoc
     */
    generate() {
        Composer_1.default.run([
            'global',
            'exec',
            'phpdocmd',
            Execution_1.default.replaceWinPathCharToUnix(TempPaths_1.default.getFilename('xml', 'structure.xml')),
            Execution_1.default.replaceWinPathCharToUnix(TempPaths_1.default.get('new-docs-workdir')),
            '-v'
        ]);
    }
    /**
     * Generates XML Data
     *
     * @param string dstPath Where to place result?
     * @param string cachePath Cache path
     */
    generateXML(dstPath, cachePath) {
        const path = Composer_1.default.getGlobalPath();
        const cmd = Execution_1.default.replaceWinPathCharToUnix(Execution_1.default.suffixExtIfRunningOnWindows(path_1.join(path, 'vendor', 'bin', 'phpdoc')));
        const args = [
            '--cache-folder',
            Execution_1.default.replaceWinPathCharToUnix(cachePath),
            '-d',
            Execution_1.default.replaceWinPathCharToUnix(process.cwd()),
            '-t',
            Execution_1.default.replaceWinPathCharToUnix(dstPath),
            '--template=xml',
            '-v',
            '--ansi',
            '--no-interaction',
            '--extensions=php'
        ].concat(core_1.getInput('ignore_files', { required: false })
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && line.length > 0)
            .map(line => `--ignore=${line}`));
        Execution_1.default.run(cmd, args, process.cwd(), { APP_ENV: 'dev' });
    }
}
exports.default = default_1;


/***/ }),

/***/ 687:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ExecBeforeGeneratorActionsAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return null;
    }
    /**
     * @inheritDoc
     */
    shouldRun(generator) {
        return generator.getBeforeActions().length > 0;
    }
    /**
     * @inheritDoc
     */
    exec(generator) {
        for (const definition of generator.getBeforeActions()) {
            definition.exec();
        }
    }
}
exports.default = ExecBeforeGeneratorActionsAction;


/***/ }),

/***/ 714:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const fs_1 = __webpack_require__(747);
const os_1 = __webpack_require__(87);
const path_1 = __webpack_require__(622);
const GeneratorActionStepDefinition_1 = __importDefault(__webpack_require__(279));
const TempPaths_1 = __importDefault(__webpack_require__(511));
const Execution_1 = __importDefault(__webpack_require__(117));
const Composer_1 = __importDefault(__webpack_require__(963));
const picomatch = __webpack_require__(827);
class default_1 {
    /**
     * @inheritDoc
     */
    getNeededTemporalPathPlaces() {
        return [];
    }
    /**
     * @inheritDoc
     */
    getComposerConfig() {
        return {};
    }
    /**
     * @inheritDoc
     */
    getGlobalComposerConfig() {
        return {};
    }
    /**
     * @inheritDoc
     */
    getGlobalComposerRequirements() {
        return {};
    }
    /**
     * @inheritDoc
     */
    getComposerRequirements() {
        return { 'clean/phpdoc-md': '*' };
    }
    /**
     * @inheritDoc
     */
    checkIfAllInputOptionsDefined() {
        return (core_1.getInput('class_root_namespace', { required: true }).length > 0 &&
            core_1.getInput('include', { required: true }).length > 0);
    }
    /**
     * @inheritDoc
     */
    getAfterActions() {
        return [
            new GeneratorActionStepDefinition_1.default(null, 'Renaming README.md to Home.md...', fs_1.renameSync, TempPaths_1.default.getFilename('new-docs-workdir', 'README.md'), TempPaths_1.default.getFilename('new-docs-workdir', 'HOME.md')),
            new GeneratorActionStepDefinition_1.default(null, 'Deleting config...', fs_1.unlinkSync, path_1.join(process.cwd(), '.phpdoc-md'))
        ];
    }
    /**
     * @inheritDoc
     */
    getBeforeActions() {
        return [
            new GeneratorActionStepDefinition_1.default(this, 'Generating generator config...', this.generateConfig, process.cwd(), core_1.getInput('class_root_namespace', { required: true }), core_1.getInput('include', { required: true })
                .replace(/\n/g, os_1.EOL)
                .split(os_1.EOL)
                .map(x => x.trim())
                .filter(x => x.length > 0), TempPaths_1.default.get('new-docs-workdir'))
        ];
    }
    /**
     * @inheritDoc
     */
    generate() {
        Composer_1.default.run(['exec', 'phpdoc-md', '-v']);
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
        Composer_1.default.run([
            'install',
            '--classmap-authoritative',
            '--no-progress',
            '--no-suggest',
            '-o',
            '--no-cache',
            '--no-scripts'
        ], cwd);
        let changedIncludeRules = include.map(key => key.replace(/\\/g, '/'));
        const badChangedIncludeRules = changedIncludeRules
            .filter(rule => rule.startsWith('!'))
            .map(rule => rule.substring(1));
        changedIncludeRules = changedIncludeRules.filter(rule => !badChangedIncludeRules.includes(rule.substring(1)));
        const classes = this.readComposerConfig()
            .filter(key => key !== null)
            .map(key => key.replace(/\\/g, '/'))
            .filter(key => picomatch.isMatch(key, changedIncludeRules))
            .filter(key => !picomatch.isMatch(key, badChangedIncludeRules))
            .map(key => key.replace(/\//g, '\\'));
        core_1.debug('Include rules:');
        if (changedIncludeRules.length > 0) {
            for (const rule of changedIncludeRules) {
                core_1.debug('  [*] '.concat(rule).replace(/\//g, '\\'));
            }
        }
        else {
            core_1.debug('  (none)');
        }
        core_1.debug('Do not include rules:');
        if (badChangedIncludeRules.length > 0) {
            for (const rule of badChangedIncludeRules) {
                core_1.debug('  [*] '.concat(rule).replace(/\//g, '\\'));
            }
        }
        else {
            core_1.debug('  (none)');
        }
        if (classes.length === 0) {
            throw new Error('No classes matches include rules');
        }
        const generated = '<?php'.concat(os_1.EOL, 'return (object)[', os_1.EOL, '    "rootNamespace" => ', JSON.stringify(rootNamespace), ',', os_1.EOL, '    "destDirectory" => ', JSON.stringify(tempDocsPath), ',', os_1.EOL, '    "format" => "github",', os_1.EOL, '    "classes" => [', os_1.EOL, '        ', classes.map(k => JSON.stringify(k)).join(','.concat(os_1.EOL, '        ')), os_1.EOL, '    ],', os_1.EOL, '];');
        core_1.debug('Generated config:');
        for (const line of generated.split('\n')) {
            core_1.debug(line.replace(/~+$/g, '').replace(/\r/g, ''));
        }
        fs_1.writeFileSync(cwd.concat('/.phpdoc-md'), generated);
    }
    /**
     * Reads autoload classes from composer
     */
    readComposerConfig() {
        return JSON.parse(Execution_1.default.getResults('php', [
            '-d',
            'display_errors=0',
            '-d',
            'error_reporting=0',
            '-r',
            'require "./vendor/autoload.php"; echo json_encode(array_keys(require("./vendor/composer/autoload_classmap.php")));'
        ], process.cwd()));
    }
}
exports.default = default_1;


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 771:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TempPaths_1 = __importDefault(__webpack_require__(511));
const Execution_1 = __importDefault(__webpack_require__(117));
class RemoveNotRequiredFilesAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Removing not required files...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return true;
    }
    /**
     * @inheritDoc
     */
    exec() {
        Execution_1.default.run('rm', ['-rf'].concat(TempPaths_1.default.getAllPaths().map(path => Execution_1.default.replaceWinPathCharToUnix(path))), process.cwd());
    }
}
exports.default = RemoveNotRequiredFilesAction;


/***/ }),

/***/ 806:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const constants = __webpack_require__(199);
const utils = __webpack_require__(265);

/**
 * Constants
 */

const {
  MAX_LENGTH,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants;

/**
 * Helpers
 */

const expandRange = (args, options) => {
  if (typeof options.expandRange === 'function') {
    return options.expandRange(...args, options);
  }

  args.sort();
  const value = `[${args.join('-')}]`;

  try {
    /* eslint-disable-next-line no-new */
    new RegExp(value);
  } catch (ex) {
    return args.map(v => utils.escapeRegex(v)).join('..');
  }

  return value;
};

/**
 * Create the message for a syntax error
 */

const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};

/**
 * Parse the given input string.
 * @param {String} input
 * @param {Object} options
 * @return {Object}
 */

const parse = (input, options) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  input = REPLACEMENTS[input] || input;

  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;

  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  const bos = { type: 'bos', value: '', output: opts.prepend || '' };
  const tokens = [bos];

  const capture = opts.capture ? '' : '?:';
  const win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const PLATFORM_CHARS = constants.globChars(win32);
  const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);

  const {
    DOT_LITERAL,
    PLUS_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  } = PLATFORM_CHARS;

  const globstar = (opts) => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const nodot = opts.dot ? '' : NO_DOT;
  const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
  let star = opts.bash === true ? globstar(opts) : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  // minimatch options support
  if (typeof opts.noext === 'boolean') {
    opts.noextglob = opts.noext;
  }

  const state = {
    input,
    index: -1,
    start: 0,
    dot: opts.dot === true,
    consumed: '',
    output: '',
    prefix: '',
    backtrack: false,
    negated: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: false,
    tokens
  };

  input = utils.removePrefix(input, state);
  len = input.length;

  const extglobs = [];
  const braces = [];
  const stack = [];
  let prev = bos;
  let value;

  /**
   * Tokenizing helpers
   */

  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index];
  const remaining = () => input.slice(state.index + 1);
  const consume = (value = '', num = 0) => {
    state.consumed += value;
    state.index += num;
  };
  const append = token => {
    state.output += token.output != null ? token.output : token.value;
    consume(token.value);
  };

  const negate = () => {
    let count = 1;

    while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
      advance();
      state.start++;
      count++;
    }

    if (count % 2 === 0) {
      return false;
    }

    state.negated = true;
    state.start++;
    return true;
  };

  const increment = type => {
    state[type]++;
    stack.push(type);
  };

  const decrement = type => {
    state[type]--;
    stack.pop();
  };

  /**
   * Push tokens onto the tokens array. This helper speeds up
   * tokenizing by 1) helping us avoid backtracking as much as possible,
   * and 2) helping us avoid creating extra tokens when consecutive
   * characters are plain text. This improves performance and simplifies
   * lookbehinds.
   */

  const push = tok => {
    if (prev.type === 'globstar') {
      const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
      const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = 'star';
        prev.value = '*';
        prev.output = star;
        state.output += prev.output;
      }
    }

    if (extglobs.length && tok.type !== 'paren' && !EXTGLOB_CHARS[tok.value]) {
      extglobs[extglobs.length - 1].inner += tok.value;
    }

    if (tok.value || tok.output) append(tok);
    if (prev && prev.type === 'text' && tok.type === 'text') {
      prev.value += tok.value;
      prev.output = (prev.output || '') + tok.value;
      return;
    }

    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };

  const extglobOpen = (type, value) => {
    const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    const output = (opts.capture ? '(' : '') + token.open;

    increment('parens');


    push({ type, value, output: state.output ? '' : ONE_CHAR });
    push({ type: 'paren', extglob: true, value: advance(), output });
    extglobs.push(token);
  };

  const extglobClose = token => {
    let output = token.close + (opts.capture ? ')' : '');

    if (token.type === 'negate') {
      let extglobStar = star;

      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
        extglobStar = globstar(opts);
      }

      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output = token.close = `)$))${extglobStar}`;
      }

      if (token.prev.type === 'bos' && eos()) {
        state.negatedExtglob = true;
      }
    }

    push({ type: 'paren', extglob: true, value, output });
    decrement('parens');
  };

  /**
   * Fast paths
   */

  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
    let backslashes = false;

    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
      if (first === '\\') {
        backslashes = true;
        return m;
      }

      if (first === '?') {
        if (esc) {
          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
        }
        return QMARK.repeat(chars.length);
      }

      if (first === '.') {
        return DOT_LITERAL.repeat(chars.length);
      }

      if (first === '*') {
        if (esc) {
          return esc + first + (rest ? star : '');
        }
        return star;
      }
      return esc ? m : `\\${m}`;
    });

    if (backslashes === true) {
      if (opts.unescape === true) {
        output = output.replace(/\\/g, '');
      } else {
        output = output.replace(/\\+/g, m => {
          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
        });
      }
    }

    if (output === input && opts.contains === true) {
      state.output = input;
      return state;
    }

    state.output = utils.wrapOutput(output, state, options);
    return state;
  }

  /**
   * Tokenize input until we reach end-of-string
   */

  while (!eos()) {
    value = advance();

    if (value === '\u0000') {
      continue;
    }

    /**
     * Escaped characters
     */

    if (value === '\\') {
      const next = peek();

      if (next === '/' && opts.bash !== true) {
        continue;
      }

      if (next === '.' || next === ';') {
        continue;
      }

      if (!next) {
        value += '\\';
        push({ type: 'text', value });
        continue;
      }

      // collapse slashes to reduce potential for exploits
      const match = /^\\+/.exec(remaining());
      let slashes = 0;

      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += '\\';
        }
      }

      if (opts.unescape === true) {
        value = advance() || '';
      } else {
        value += advance() || '';
      }

      if (state.brackets === 0) {
        push({ type: 'text', value });
        continue;
      }
    }

    /**
     * If we're inside a regex character class, continue
     * until we reach the closing bracket.
     */

    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
      if (opts.posix !== false && value === ':') {
        const inner = prev.value.slice(1);
        if (inner.includes('[')) {
          prev.posix = true;

          if (inner.includes(':')) {
            const idx = prev.value.lastIndexOf('[');
            const pre = prev.value.slice(0, idx);
            const rest = prev.value.slice(idx + 2);
            const posix = POSIX_REGEX_SOURCE[rest];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();

              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR;
              }
              continue;
            }
          }
        }
      }

      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
        value = `\\${value}`;
      }

      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
        value = `\\${value}`;
      }

      if (opts.posix === true && value === '!' && prev.value === '[') {
        value = '^';
      }

      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * If we're inside a quoted string, continue
     * until we reach the closing double quote.
     */

    if (state.quotes === 1 && value !== '"') {
      value = utils.escapeRegex(value);
      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * Double quotes
     */

    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: 'text', value });
      }
      continue;
    }

    /**
     * Parentheses
     */

    if (value === '(') {
      increment('parens');
      push({ type: 'paren', value });
      continue;
    }

    if (value === ')') {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError('opening', '('));
      }

      const extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }

      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
      decrement('parens');
      continue;
    }

    /**
     * Square brackets
     */

    if (value === '[') {
      if (opts.nobracket === true || !remaining().includes(']')) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('closing', ']'));
        }

        value = `\\${value}`;
      } else {
        increment('brackets');
      }

      push({ type: 'bracket', value });
      continue;
    }

    if (value === ']') {
      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('opening', '['));
        }

        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      decrement('brackets');

      const prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
        value = `/${value}`;
      }

      prev.value += value;
      append({ value });

      // when literal brackets are explicitly disabled
      // assume we should match with a regex character class
      if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
        continue;
      }

      const escaped = utils.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);

      // when literal brackets are explicitly enabled
      // assume we should escape the brackets to match literal characters
      if (opts.literalBrackets === true) {
        state.output += escaped;
        prev.value = escaped;
        continue;
      }

      // when the user specifies nothing, try to match both
      prev.value = `(${capture}${escaped}|${prev.value})`;
      state.output += prev.value;
      continue;
    }

    /**
     * Braces
     */

    if (value === '{' && opts.nobrace !== true) {
      increment('braces');

      const open = {
        type: 'brace',
        value,
        output: '(',
        outputIndex: state.output.length,
        tokensIndex: state.tokens.length
      };

      braces.push(open);
      push(open);
      continue;
    }

    if (value === '}') {
      const brace = braces[braces.length - 1];

      if (opts.nobrace === true || !brace) {
        push({ type: 'text', value, output: value });
        continue;
      }

      let output = ')';

      if (brace.dots === true) {
        const arr = tokens.slice();
        const range = [];

        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === 'brace') {
            break;
          }
          if (arr[i].type !== 'dots') {
            range.unshift(arr[i].value);
          }
        }

        output = expandRange(range, opts);
        state.backtrack = true;
      }

      if (brace.comma !== true && brace.dots !== true) {
        const out = state.output.slice(0, brace.outputIndex);
        const toks = state.tokens.slice(brace.tokensIndex);
        brace.value = brace.output = '\\{';
        value = output = `\\}`;
        state.output = out;
        for (const t of toks) {
          state.output += (t.output || t.value);
        }
      }

      push({ type: 'brace', value, output });
      decrement('braces');
      braces.pop();
      continue;
    }

    /**
     * Pipes
     */

    if (value === '|') {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: 'text', value });
      continue;
    }

    /**
     * Commas
     */

    if (value === ',') {
      let output = value;

      const brace = braces[braces.length - 1];
      if (brace && stack[stack.length - 1] === 'braces') {
        brace.comma = true;
        output = '|';
      }

      push({ type: 'comma', value, output });
      continue;
    }

    /**
     * Slashes
     */

    if (value === '/') {
      // if the beginning of the glob is "./", advance the start
      // to the current index, and don't add the "./" characters
      // to the state. This greatly simplifies lookbehinds when
      // checking for BOS characters like "!" and "." (not "./")
      if (prev.type === 'dot' && state.index === state.start + 1) {
        state.start = state.index + 1;
        state.consumed = '';
        state.output = '';
        tokens.pop();
        prev = bos; // reset "prev" to the first token
        continue;
      }

      push({ type: 'slash', value, output: SLASH_LITERAL });
      continue;
    }

    /**
     * Dots
     */

    if (value === '.') {
      if (state.braces > 0 && prev.type === 'dot') {
        if (prev.value === '.') prev.output = DOT_LITERAL;
        const brace = braces[braces.length - 1];
        prev.type = 'dots';
        prev.output += value;
        prev.value += value;
        brace.dots = true;
        continue;
      }

      if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
        push({ type: 'text', value, output: DOT_LITERAL });
        continue;
      }

      push({ type: 'dot', value, output: DOT_LITERAL });
      continue;
    }

    /**
     * Question marks
     */

    if (value === '?') {
      const isGroup = prev && prev.value === '(';
      if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('qmark', value);
        continue;
      }

      if (prev && prev.type === 'paren') {
        const next = peek();
        let output = value;

        if (next === '<' && !utils.supportsLookbehinds()) {
          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
        }

        if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
          output = `\\${value}`;
        }

        push({ type: 'text', value, output });
        continue;
      }

      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
        push({ type: 'qmark', value, output: QMARK_NO_DOT });
        continue;
      }

      push({ type: 'qmark', value, output: QMARK });
      continue;
    }

    /**
     * Exclamation
     */

    if (value === '!') {
      if (opts.noextglob !== true && peek() === '(') {
        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
          extglobOpen('negate', value);
          continue;
        }
      }

      if (opts.nonegate !== true && state.index === 0) {
        negate();
        continue;
      }
    }

    /**
     * Plus
     */

    if (value === '+') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('plus', value);
        continue;
      }

      if ((prev && prev.value === '(') || opts.regex === false) {
        push({ type: 'plus', value, output: PLUS_LITERAL });
        continue;
      }

      if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
        push({ type: 'plus', value });
        continue;
      }

      push({ type: 'plus', value: PLUS_LITERAL });
      continue;
    }

    /**
     * Plain text
     */

    if (value === '@') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        push({ type: 'at', extglob: true, value, output: '' });
        continue;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Plain text
     */

    if (value !== '*') {
      if (value === '$' || value === '^') {
        value = `\\${value}`;
      }

      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Stars
     */

    if (prev && (prev.type === 'globstar' || prev.star === true)) {
      prev.type = 'star';
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.globstar = true;
      consume(value);
      continue;
    }

    let rest = remaining();
    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
      extglobOpen('star', value);
      continue;
    }

    if (prev.type === 'star') {
      if (opts.noglobstar === true) {
        consume(value);
        continue;
      }

      const prior = prev.prev;
      const before = prior.prev;
      const isStart = prior.type === 'slash' || prior.type === 'bos';
      const afterStar = before && (before.type === 'star' || before.type === 'globstar');

      if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
      const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      // strip consecutive `/**/`
      while (rest.slice(0, 3) === '/**') {
        const after = input[state.index + 4];
        if (after && after !== '/') {
          break;
        }
        rest = rest.slice(3);
        consume('/**', 3);
      }

      if (prior.type === 'bos' && eos()) {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
        prev.value += value;
        state.globstar = true;
        state.output += prior.output + prev.output;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
        const end = rest[1] !== void 0 ? '|$' : '';

        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
        prev.value += value;

        state.output += prior.output + prev.output;
        state.globstar = true;

        consume(value + advance());

        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      if (prior.type === 'bos' && rest[0] === '/') {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
        state.output = prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      // remove single star from output
      state.output = state.output.slice(0, -prev.output.length);

      // reset previous token to globstar
      prev.type = 'globstar';
      prev.output = globstar(opts);
      prev.value += value;

      // reset output with globstar
      state.output += prev.output;
      state.globstar = true;
      consume(value);
      continue;
    }

    const token = { type: 'star', value, output: star };

    if (opts.bash === true) {
      token.output = '.*?';
      if (prev.type === 'bos' || prev.type === 'slash') {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }

    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
      token.output = value;
      push(token);
      continue;
    }

    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
      if (prev.type === 'dot') {
        state.output += NO_DOT_SLASH;
        prev.output += NO_DOT_SLASH;

      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH;
        prev.output += NO_DOTS_SLASH;

      } else {
        state.output += nodot;
        prev.output += nodot;
      }

      if (peek() !== '*') {
        state.output += ONE_CHAR;
        prev.output += ONE_CHAR;
      }
    }

    push(token);
  }

  while (state.brackets > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
    state.output = utils.escapeLast(state.output, '[');
    decrement('brackets');
  }

  while (state.parens > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
    state.output = utils.escapeLast(state.output, '(');
    decrement('parens');
  }

  while (state.braces > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
    state.output = utils.escapeLast(state.output, '{');
    decrement('braces');
  }

  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
  }

  // rebuild the output if we had to backtrack at any point
  if (state.backtrack === true) {
    state.output = '';

    for (const token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;

      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }

  return state;
};

/**
 * Fast paths for creating regular expressions for common glob patterns.
 * This can significantly speed up processing and has very little downside
 * impact when none of the fast paths match.
 */

parse.fastpaths = (input, options) => {
  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  input = REPLACEMENTS[input] || input;
  const win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const {
    DOT_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOTS_SLASH,
    STAR,
    START_ANCHOR
  } = constants.globChars(win32);

  const nodot = opts.dot ? NO_DOTS : NO_DOT;
  const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
  const capture = opts.capture ? '' : '?:';
  const state = { negated: false, prefix: '' };
  let star = opts.bash === true ? '.*?' : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  const globstar = (opts) => {
    if (opts.noglobstar === true) return star;
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const create = str => {
    switch (str) {
      case '*':
        return `${nodot}${ONE_CHAR}${star}`;

      case '.*':
        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*.*':
        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*/*':
        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

      case '**':
        return nodot + globstar(opts);

      case '**/*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

      case '**/*.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '**/.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

      default: {
        const match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;

        const source = create(match[1]);
        if (!source) return;

        return source + DOT_LITERAL + match[2];
      }
    }
  };

  const output = utils.removePrefix(input, state);
  let source = create(output);

  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL}?`;
  }

  return source;
};

module.exports = parse;


/***/ }),

/***/ 827:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(366);


/***/ }),

/***/ 850:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __webpack_require__(87);
const core_1 = __webpack_require__(470);
const fs_1 = __webpack_require__(747);
const TempPaths_1 = __importDefault(__webpack_require__(511));
const readDirSync = __webpack_require__(120);
class PrefixAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Prefixing file lines...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return this.getPrefixLines().length > 0;
    }
    /**
     * @inheritDoc
     */
    exec() {
        const newDocs = TempPaths_1.default.get('new-docs-workdir');
        const prefix = this.getPrefixLines();
        for (const file of readDirSync(newDocs)) {
            core_1.debug(`  ${file.toString()}`);
            const content = fs_1.readFileSync(file.toString(), 'utf8');
            const newContent = prefix.concat(content
                .split(/\n/g)
                .map(line => line.trimRight())
                .join(os_1.EOL));
            fs_1.writeFileSync(file.toString(), newContent);
        }
    }
    /**
     * Gets prefix that should be used for each file
     */
    getPrefixLines() {
        let lines = core_1.getInput('prefix_lines', { required: false });
        if (typeof lines == 'string' && lines.length > 0) {
            lines = lines.concat(os_1.EOL);
        }
        else {
            lines = '';
        }
        return lines;
    }
}
exports.default = PrefixAction;


/***/ }),

/***/ 854:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TempPaths_1 = __importDefault(__webpack_require__(511));
const core_1 = __webpack_require__(470);
class InitTempPathsAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Configuring temporal paths...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return true;
    }
    /**
     * @inheritDoc
     */
    exec(generator) {
        const places = generator
            .getNeededTemporalPathPlaces()
            .concat([
            'new-docs-main',
            'composer-global-backup',
            'composer-local-backup'
        ])
            .filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
        for (const place of places) {
            TempPaths_1.default.add(place, true);
        }
        TempPaths_1.default.add('old-docs-main', false);
        TempPaths_1.default.addSubpathAlias('old-docs-workdir', 'old-docs-main', core_1.getInput('workdir', { required: false }));
        TempPaths_1.default.addSubpathAlias('new-docs-workdir', 'new-docs-main', core_1.getInput('workdir', { required: false }));
        TempPaths_1.default.debug();
    }
}
exports.default = InitTempPathsAction;


/***/ }),

/***/ 920:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __webpack_require__(747);
const path_1 = __webpack_require__(622);
const TempPaths_1 = __importDefault(__webpack_require__(511));
const Composer_1 = __importDefault(__webpack_require__(963));
class RestoreComposerFiles {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Restoring backuped Composer files...';
    }
    /**
     * @inheritDoc
     */
    shouldRun(generator) {
        return (Object.keys(generator.getGlobalComposerRequirements()).length > 0 ||
            Object.keys(generator.getComposerRequirements()).length > 0);
    }
    /**
     * @inheritDoc
     */
    exec() {
        const globalPath = Composer_1.default.getGlobalPath();
        this.restoreFile('composer.lock', 'composer-local-backup', process.cwd());
        this.restoreFile('composer.json', 'composer-local-backup', process.cwd());
        this.restoreFile('composer.lock', 'composer-global-backup', globalPath);
        this.restoreFile('composer.json', 'composer-global-backup', globalPath);
        this.restoreFile('config.json', 'composer-global-backup', globalPath);
    }
    /**
     * Restores backup file
     *
     * @param string shortFilename File to restore
     * @param string srcType Source temp path type
     * @param string dstPath Where to restore
     */
    restoreFile(shortFilename, srcType, dstPath) {
        const bkpFilename = TempPaths_1.default.getFilename(srcType, shortFilename);
        if (!fs_1.existsSync(bkpFilename)) {
            return;
        }
        const dstFile = path_1.join(dstPath, shortFilename);
        if (fs_1.existsSync(dstFile)) {
            fs_1.unlinkSync(dstFile);
        }
        fs_1.renameSync(bkpFilename, dstFile);
    }
}
exports.default = RestoreComposerFiles;


/***/ }),

/***/ 963:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Execution_1 = __importDefault(__webpack_require__(117));
/**
 * Helper for composer actions
 */
class ComposerHandler {
    /**
     * Constructor
     */
    constructor() {
        /**
         * Global Composer path
         */
        this.globalPath = null;
        this.execName = Execution_1.default.suffixExtIfRunningOnWindows('composer');
    }
    /**
     * Gets global composer path
     *
     * @return string
     */
    getGlobalPath() {
        if (this.globalPath === null) {
            this.globalPath = this.getResults(['config', '-g', 'home']).trim();
        }
        return this.globalPath === null ? '' : this.globalPath;
    }
    /**
     * Executes composer command and prints to debug results and returns result as string
     *
     * @param Array<string> args Command arguments
     * @param string|null cwd Where to execute
     *
     * @return string
     */
    getResults(args, cwd = null) {
        if (cwd === null) {
            cwd = process.cwd();
        }
        return Execution_1.default.getResults(this.execName, args.concat(['--no-interaction', '--ansi']), cwd);
    }
    /**
     * Executes composer command and prints to debug results
     *
     * @param Array<string> args Command arguments
     * @param string|null cwd Where to execute
     */
    run(args, cwd = null) {
        this.getResults(args, cwd);
    }
    /**
     * Remove dev requirements
     */
    removeDevRequirements() {
        this.run(['install', '--no-dev']);
    }
    /**
     * Installing dev requirements
     */
    installDevRequirements() {
        this.run(['install']);
    }
}
exports.default = new ComposerHandler();


/***/ }),

/***/ 981:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TempPaths_1 = __importDefault(__webpack_require__(511));
const Execution_1 = __importDefault(__webpack_require__(117));
class CopyOldGitDataToNewPlaceAction {
    /**
     * @inheritDoc
     */
    getDescription() {
        return 'Updating docs folder...';
    }
    /**
     * @inheritDoc
     */
    shouldRun() {
        return true;
    }
    /**
     * @inheritDoc
     */
    exec() {
        const newDocs = TempPaths_1.default.get('new-docs-main');
        const oldDocs = TempPaths_1.default.get('old-docs-main');
        Execution_1.default.run('cp', ['-r', oldDocs.concat('/.git'), newDocs.concat('/.git')], process.cwd());
    }
}
exports.default = CopyOldGitDataToNewPlaceAction;


/***/ })

/******/ });