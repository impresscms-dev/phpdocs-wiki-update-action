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
    exec(generator, info) {
        generator.generate(info);
    }
}
exports.default = GenerateAction;


/***/ }),

/***/ 36:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const helpers_1 = __webpack_require__(872);
module.exports = class GitInfo {
    /**
     * Constructor
     */
    constructor(cwd) {
        this.cwd = cwd;
        this.lastCommitEmail = this.execGitShowCommand('%ae');
        this.lastCommitAuthor = this.execGitShowCommand('%an');
        const branch = helpers_1.execCommandAndReturn('git', ['rev-parse', '--abbrev-ref', 'HEAD'], this.cwd);
        if (branch === 'HEAD') {
            this.isTag = true;
            this.branchOrTagName = helpers_1.execCommandAndReturn('git', ['describe', '--tags', '--abbrev=0'], this.cwd);
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
        return helpers_1.execCommandAndReturn('git', ['show', '-s', `--format='${format}'`, 'HEAD'], this.cwd);
    }
    /**
     * Creates GitInfo for current process
     */
    static createInstance() {
        return new GitInfo(process.cwd());
    }
};


/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

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

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const helpers_1 = __webpack_require__(872);
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
    exec(generator, info) {
        const cwd = core_1.getInput('temp_docs_folder');
        try {
            helpers_1.execCommand('git', ['push', '-u', 'origin', info.branchOrTagName], cwd);
        }
        catch (e) {
            helpers_1.execCommand('git', ['pull'], cwd);
            helpers_1.execCommand('git', ['push', '.', info.branchOrTagName], cwd);
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

Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __webpack_require__(872);
const fs_1 = __webpack_require__(747);
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
        if (fs_1.existsSync('composer.lock')) {
            fs_1.copyFileSync('composer.lock', '.composer.lock.bkp');
        }
        fs_1.copyFileSync('composer.json', '.composer.json.bkp');
        helpers_1.composer(['require', '--dev', '--no-progress', '--no-suggest'].concat(packages));
        helpers_1.composer(['exec']);
    }
}
exports.default = InstallAction;


/***/ }),

/***/ 180:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const fs_1 = __webpack_require__(747);
const path_1 = __webpack_require__(622);
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
        const newDocs = core_1.getInput('temp_docs_folder');
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
            if (process.platform === 'win32') {
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
        const content = fs_1.readFileSync(filename).toString();
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
                return '['.concat(name, '](', allPossibleFilenames[link]
                    .split('.')
                    .slice(0, -1)
                    .join('.'), ')');
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
        return filenameWithoutExt.concat(filenameWithoutExt, ' (', namespaceName, ')', ext);
    }
}
exports.default = FlattenFileStructureAction;


/***/ }),

/***/ 186:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const fs_1 = __webpack_require__(747);
const helpers_1 = __webpack_require__(872);
const path_1 = __webpack_require__(622);
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
    exec(generator, gitInfo) {
        const oldDocsDir = this.getOldDocsPath();
        if (fs_1.existsSync(oldDocsDir)) {
            throw new Error(oldDocsDir.concat(" already exists but shouldn't"));
        }
        fs_1.mkdirSync(oldDocsDir);
        helpers_1.execCommand('git', [
            'clone',
            `https://${this.getUpdateUser()}:${this.getUpdateToken()}@github.com/${gitInfo.getCurrentRepositoryName()}.wiki.git`,
            path_1.basename(oldDocsDir)
        ], path_1.dirname(oldDocsDir));
        helpers_1.execCommand('git', ['config', '--local', 'gc.auto', '0'], oldDocsDir);
        helpers_1.execCommand('git', ['checkout', '-B', gitInfo.branchOrTagName, '--track'], oldDocsDir);
    }
    /**
     * Gets GitHub token that will be used for update action
     */
    getUpdateToken() {
        return core_1.getInput('wiki_github_update_token');
    }
    /**
     * Get GitHub user for witch token belongs
     */
    getUpdateUser() {
        return core_1.getInput('wiki_github_update_user');
    }
    /**
     * Get old docs path
     */
    getOldDocsPath() {
        return core_1.getInput('temp_docs_folder').concat('.old');
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
const actions = [
    new global_install_1.default(),
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
     * @param GeneratorInterface|null generator Linked generator
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
     *
     * @param gitInfo
     */
    exec(gitInfo) {
        core_1.info(this.description);
        const args = this.args.concat([gitInfo]);
        this.execCallback.apply(this.generator, args);
    }
}
exports.default = GeneratorActionStepDefinition;


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
const GitInfo_1 = __importDefault(__webpack_require__(36));
try {
    const generatorName = core_1.getInput('engine');
    if (typeof generators_1.default[generatorName] == 'undefined') {
        throw new Error('Unknown selected generator name');
    }
    const generator = generators_1.default[generatorName];
    if (!generator.checkIfAllInputOptionsDefined()) {
        throw new TypeError('Not all required arguments defined for selected engine');
    }
    const gitInfo = GitInfo_1.default.createInstance();
    for (const action of actions_1.default) {
        if (!action.shouldRun(generator, gitInfo)) {
            continue;
        }
        const desc = action.getDescription();
        if (desc !== null) {
            core_1.info(desc);
        }
        action.exec(generator, gitInfo);
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
    shouldRun(generator, info) {
        return generator.getAfterActions(info).length > 0;
    }
    /**
     * @inheritDoc
     */
    exec(generator, info) {
        for (const definition of generator.getAfterActions(info)) {
            definition.exec(info);
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

Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __webpack_require__(872);
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
        helpers_1.composer(['global', 'require', '--dev', '--no-progress', '--no-suggest'].concat(packages));
        helpers_1.composer(['global', 'exec']);
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

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const helpers_1 = __webpack_require__(872);
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
    exec(generator, info) {
        const cwd = core_1.getInput('temp_docs_folder');
        helpers_1.execCommand('git', ['config', '--local', 'user.email', info.lastCommitEmail], cwd);
        helpers_1.execCommand('git', ['config', '--local', 'user.name', info.lastCommitAuthor], cwd);
    }
}
exports.default = ConfigureCommitAuthorAction;


/***/ }),

/***/ 481:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __webpack_require__(872);
const fs_1 = __webpack_require__(747);
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
        fs_1.unlinkSync('composer.lock');
        fs_1.unlinkSync('composer.json');
        if (fs_1.existsSync('.composer.lock.bkp')) {
            fs_1.renameSync('.composer.lock.bkp', 'composer.lock');
        }
        fs_1.renameSync('.composer.json.bkp', 'composer.json');
        helpers_1.composer(['install', '--no-progress', '--no-suggest']);
    }
}
exports.default = UninstallAction;


/***/ }),

/***/ 484:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const helpers_1 = __webpack_require__(872);
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
        const cwd = core_1.getInput('temp_docs_folder');
        helpers_1.execCommand('git', ['status'], cwd);
    }
}
exports.default = CheckStatusAction;


/***/ }),

/***/ 533:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __webpack_require__(872);
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
    exec(generator) {
        const packages = Object.keys(generator.getGlobalComposerRequirements());
        helpers_1.composer(['global', 'remove', '--dev', '--no-progress'].concat(packages));
    }
}
exports.default = GlobalUninstallAction;


/***/ }),

/***/ 534:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const helpers_1 = __webpack_require__(872);
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
    exec(generator, info) {
        const cwd = core_1.getInput('temp_docs_folder');
        helpers_1.execCommand('git', ['add', '-u', ':/'], cwd);
        helpers_1.execCommand('git', ['add', '.'], cwd);
        try {
            helpers_1.execCommand('git', [
                'commit',
                '-m',
                `Automatically generated for https://github.com/${info.getCurrentRepositoryName()}/commit/${info.getCurrentLastCommitSHA()}`
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
const helpers_1 = __webpack_require__(872);
const GeneratorActionStepDefinition_1 = __importDefault(__webpack_require__(279));
const core_1 = __webpack_require__(470);
const fs_1 = __webpack_require__(747);
class default_1 {
    /**
     * @inheritDoc
     */
    getGlobalComposerRequirements() {
        return {
            'phpdocumentor/phpdocumentor': '2.9.*',
            'symfony/process': '~2.0'
        };
    }
    /**
     * @inheritDoc
     */
    getComposerRequirements() {
        return { 'evert/phpdoc-md': '~0.2.0' };
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
            new GeneratorActionStepDefinition_1.default(null, 'Deleting XML data...', this.deleteFolder, core_1.getInput('temp_docs_folder').concat('.xml')),
            new GeneratorActionStepDefinition_1.default(null, 'Deleting Cache data...', this.deleteFolder, core_1.getInput('temp_docs_folder').concat('.cache'))
        ];
    }
    /**
     * @inheritDoc
     */
    getBeforeActions() {
        return [
            new GeneratorActionStepDefinition_1.default(this, 'Removing dev requirements...', this.removeDevRequirements),
            new GeneratorActionStepDefinition_1.default(this, 'Generating XML data...', this.generateXML, core_1.getInput('temp_docs_folder').concat('.xml'), core_1.getInput('temp_docs_folder').concat('.cache')),
            new GeneratorActionStepDefinition_1.default(this, 'Install dev requirements...', this.installDevRequirements),
            new GeneratorActionStepDefinition_1.default(null, 'Creating docs folder...', fs_1.mkdirSync, core_1.getInput('temp_docs_folder'))
        ];
    }
    /**
     * @inheritDoc
     */
    generate() {
        helpers_1.composer([
            'exec',
            'phpdocmd',
            core_1.getInput('temp_docs_folder').concat('.xml/structure.xml'),
            core_1.getInput('temp_docs_folder'),
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
        try {
            helpers_1.composer([
                'global',
                'exec',
                'phpdoc',
                '-v',
                '--',
                '--cache-folder',
                cachePath,
                '-d',
                process.cwd().replace(/\\/g, '/'),
                '-t',
                dstPath,
                '--template=xml'
            ]);
        }
        catch (e) {
            helpers_1.composer([
                'global',
                'exec',
                'phpdoc.php',
                '-v',
                '--',
                '--cache-folder',
                cachePath,
                '-d',
                process.cwd().replace(/\\/g, '/'),
                '-t',
                dstPath,
                '--template=xml'
            ]);
        }
    }
    /**
     * Removes data folder
     *
     * @param string pathToDelete Path to delete
     */
    deleteFolder(pathToDelete) {
        helpers_1.execCommand('rm', ['-rf', pathToDelete], process.cwd());
    }
    /**
     * Remove dev requirements
     */
    removeDevRequirements() {
        helpers_1.composer(['install', '--no-dev']);
    }
    /**
     * Installing dev requirements
     */
    installDevRequirements() {
        helpers_1.composer(['install']);
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
    shouldRun(generator, info) {
        return generator.getBeforeActions(info).length > 0;
    }
    /**
     * @inheritDoc
     */
    exec(generator, info) {
        for (const definition of generator.getBeforeActions(info)) {
            definition.exec(info);
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
const helpers_1 = __webpack_require__(872);
const fs_1 = __webpack_require__(747);
const os_1 = __webpack_require__(87);
const GeneratorActionStepDefinition_1 = __importDefault(__webpack_require__(279));
const picomatch = __webpack_require__(827);
class default_1 {
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
            new GeneratorActionStepDefinition_1.default(this, 'Generating generator config...', this.generateConfig, process.cwd(), core_1.getInput('class_root_namespace'), core_1.getInput('include')
                .replace(/\n/g, os_1.EOL)
                .split(os_1.EOL)
                .map(x => x.trim())
                .filter(x => x.length > 0), core_1.getInput('temp_docs_folder'))
        ];
    }
    /**
     * @inheritDoc
     */
    generate() {
        helpers_1.composer(['exec', 'phpdoc-md', '-v']);
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
        helpers_1.composer([
            'install',
            '--classmap-authoritative',
            '--no-progress',
            '--no-suggest',
            '-o',
            '--no-cache',
            '--no-scripts'
        ], cwd);
        /*  composer(['dump', '--classmap-authoritative', '-o', '--no-scripts'], cwd)*/
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
        /*execCommand('php', ['--version'], process.cwd())
        execCommand(
          'cat',
          ['./vendor/composer/autoload_classmap.php'],
          process.cwd()
        )*/
        return JSON.parse(helpers_1.execCommandAndReturn('php', [
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

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const helpers_1 = __webpack_require__(872);
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
        const newDocs = core_1.getInput('temp_docs_folder');
        const oldDocs = newDocs.concat('.old');
        helpers_1.execCommand('rm', ['-rf', newDocs, oldDocs, '.phpdoc-md'], process.cwd());
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

Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __webpack_require__(87);
const core_1 = __webpack_require__(470);
const fs_1 = __webpack_require__(747);
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
        const newDocs = core_1.getInput('temp_docs_folder');
        const prefix = this.getPrefixLines();
        for (const file of readDirSync(newDocs)) {
            core_1.debug(' '.concat(file.toString()));
            fs_1.writeFileSync(file.toString(), prefix.concat(fs_1.readFileSync(file.toString()).toString()));
        }
    }
    /**
     * Gets prefix that should be used for each file
     */
    getPrefixLines() {
        let lines = core_1.getInput('prefix_lines');
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

/***/ 872:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const child_process_1 = __webpack_require__(129);
const os_1 = __webpack_require__(87);
/**
 * Executes command and prints to debug results
 *
 * @param string cmd  Command to be executed
 * @param Array<string> args Command arguments
 * @param string cwd Where to execute
 */
function execCommand(cmd, args, cwd) {
    execCommandAndReturn(cmd, args, cwd);
}
exports.execCommand = execCommand;
/**
 * Executes command and return result as string
 *
 * @param string cmd  Command to be executed
 * @param Array<string> args Command arguments
 * @param string cwd Where to execute
 */
function execCommandAndReturn(cmd, args, cwd) {
    var _a;
    core_1.debug(` Executing ${cmd} ${args.join(' ')} in ${cwd}...`);
    const proc = child_process_1.spawnSync(cmd, args, { cwd });
    const out = (_a = proc.output) === null || _a === void 0 ? void 0 : _a.join('\n').trim().replace(/\n/g, os_1.EOL);
    for (const outputLine of out.split(os_1.EOL)) {
        core_1.debug(outputLine.trim());
    }
    if (proc.status === 0) {
        return out;
    }
    throw new Error(`Execution failed`);
}
exports.execCommandAndReturn = execCommandAndReturn;
/**
 * Executes composer command and prints to debug results
 *
 * @param Array<string> args Command arguments
 * @param string|null cwd Where to execute
 */
function composer(args, cwd = null) {
    if (cwd === null) {
        cwd = process.cwd();
    }
    let cmd = 'composer';
    if (process.platform.toString() === 'win32' ||
        process.platform.toString() === 'win64') {
        cmd = 'composer.bat';
    }
    execCommandAndReturn(cmd, args.concat(['--no-interaction', '--ansi']), cwd);
}
exports.composer = composer;


/***/ }),

/***/ 981:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(470);
const helpers_1 = __webpack_require__(872);
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
        const newDocs = core_1.getInput('temp_docs_folder');
        const oldDocs = newDocs.concat('.old');
        helpers_1.execCommand('cp', ['-r', oldDocs.concat('/.git'), newDocs.concat('/.git')], process.cwd());
    }
}
exports.default = CopyOldGitDataToNewPlaceAction;


/***/ })

/******/ });