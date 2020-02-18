module.exports =
  /******/ (function (modules, runtime) { // webpackBootstrap
  /******/
  "use strict";
  /******/ 	// The module cache
  /******/
  var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/
  function __webpack_require__(moduleId) {
    /******/
    /******/ 		// Check if module is in cache
    /******/
    if (installedModules[moduleId]) {
      /******/
      return installedModules[moduleId].exports;
      /******/
    }
    /******/ 		// Create a new module (and put it into the cache)
    /******/
    var module = installedModules[moduleId] = {
      /******/      i: moduleId,
      /******/      l: false,
      /******/      exports: {}
      /******/
    };
    /******/
    /******/ 		// Execute the module function
    /******/
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ 		// Flag the module as loaded
    /******/
    module.l = true;
    /******/
    /******/ 		// Return the exports of the module
    /******/
    return module.exports;
    /******/
  }

  /******/
  /******/
  /******/
  __webpack_require__.ab = __dirname + "/";
  /******/
  /******/ 	// the startup function
  /******/
  function startup() {
    /******/ 		// Load entry module and return exports
    /******/
    return __webpack_require__(325);
    /******/
  };
  /******/
  /******/ 	// run startup
  /******/
  return startup();
  /******/
})
  /************************************************************************/
  /******/ ({

    /***/ 36:
    /***/ (function (module, __unusedexports, __webpack_require__) {

      "use strict";

      const child_process_1 = __webpack_require__(129);
      module.exports = class GitInfo {
        /**
         * Constructor
         */
        constructor(cwd) {
          this.cwd = cwd;
          this.lastCommitEmail = this.execGitShowCommand('%ae');
          this.lastCommitAuthor = this.execGitShowCommand('%an');
          const branch = child_process_1.spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
            stdio: 'pipe',
            cwd: this.cwd
          }).output.toString();
          if (branch === 'HEAD') {
            this.isTag = true;
            this.branchOrTagName = child_process_1.spawnSync('git', ['describe', '--tags', '--abbrev=0'], {
              stdio: 'pipe',
              cwd: this.cwd
            }).output.toString();
          } else {
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
          return child_process_1.spawnSync('git', ['show', '-s', `--format='${format}'`, 'HEAD'], {
            stdio: 'pipe',
            cwd: this.cwd
          }).output.toString();
        }
      };


      /***/
    }),

    /***/ 87:
    /***/ (function (module) {

      module.exports = require("os");

      /***/
    }),

    /***/ 129:
    /***/ (function (module) {

      module.exports = require("child_process");

      /***/
    }),

    /***/ 325:
    /***/ (function (__unusedmodule, exports, __webpack_require__) {

      "use strict";

      var __importDefault = (this && this.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : {"default": mod};
      };
      Object.defineProperty(exports, "__esModule", {value: true});
      const core_1 = __webpack_require__(470);
      const GitInfo_1 = __importDefault(__webpack_require__(36));

      class Main {
        /**
         * Constructor
         */
        constructor() {
          /**
           * Action to execute
           */
          this.actions = [
            'install',
            'clone-wiki',
            'exec-before-generator-actions',
            'generate',
            'exec-after-generator-actions',
            'flatten-file-structure',
            'prefix',
            'copy-old-git-data-to-new-place',
            'configure-commit-author',
            'check-status',
            'commit',
            'push-update'
          ];
          this.generator = this.makeGeneratorInstance();
          this.gitInfo = new GitInfo_1.default(process.cwd());
        }

        /**
         * Gets engine name
         */
        getEngineName() {
          return 'phpdoc-md';
          return core_1.getInput('engine');
        }

        /**
         * Makes generator instance
         */
        makeGeneratorInstance() {
          const name = `./generators/${this.getEngineName()}`;
          const signature = require(name).default;
          return new signature();
        }

        /**
         * Validates all parameters before starting generator
         */
        validate() {
          if (!this.generator.checkIfAllInputOptionsDefined()) {
            throw new TypeError("Not all required arguments defined for selected engine");
          }
        }

        /**
         * Get all actions instances that should run
         */
        getAllActions() {
          return this.actions.map((action) => require(`./actions/${action}`).default).filter((actionInstance) => actionInstance.shouldRun(this.generator, this.gitInfo));
        }
      }

      try {
        const app = new Main();
        app.validate();
        for (const actionInstance of app.getAllActions()) {
          let desc = actionInstance.getDescription();
          if (desc !== null) {
            core_1.info(desc);
          }
          actionInstance.exec(app.generator, app.gitInfo);
        }
      } catch (error) {
        core_1.setFailed(error.message);
      }


      /***/
    }),

    /***/ 431:
    /***/ (function (__unusedmodule, exports, __webpack_require__) {

      "use strict";

      var __importStar = (this && this.__importStar) || function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result["default"] = mod;
        return result;
      };
      Object.defineProperty(exports, "__esModule", {value: true});
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
                  } else {
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

      /***/
    }),

    /***/ 470:
    /***/ (function (__unusedmodule, exports, __webpack_require__) {

      "use strict";

      var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
          });
        }

        return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }

          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }

          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }

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
      Object.defineProperty(exports, "__esModule", {value: true});
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
        command_1.issueCommand('set-env', {name}, val);
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
        command_1.issueCommand('set-output', {name}, value);
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
          } finally {
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
        command_1.issueCommand('save-state', {name}, value);
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

      /***/
    }),

    /***/ 622:
    /***/ (function (module) {

      module.exports = require("path");

      /***/
    })

    /******/
  });