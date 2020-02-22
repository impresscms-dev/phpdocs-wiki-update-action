"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const GitInfo_1 = __importDefault(require("./GitInfo"));
/**
 * Validates generator data
 *
 * @param object generator Generator to validate
 */
function validateGenerator(generator) {
    if (!generator.checkIfAllInputOptionsDefined()) {
        throw new TypeError('Not all required arguments defined for selected engine');
    }
}
exports.validateGenerator = validateGenerator;
/**
 * Executes command and prints to debug results
 *
 * @param string cmd  Command to be executed
 * @param Array<string> args Command arguments
 * @param string cwd Where to execute
 */
function execCommand(cmd, args, cwd) {
    core_1.debug(child_process_1.spawnSync(cmd, args, {
        cwd
    }).output.toString());
}
exports.execCommand = execCommand;
/**
 * Makes generator instance
 */
async function makeGeneratorInstance(engineName) {
  const signature = (await Promise.resolve().then(() => __importStar(require(`./generators/${engineName}`)))).default;
  return new signature();
}
exports.makeGeneratorInstance = makeGeneratorInstance;
/**
 * Gets engine name
 */
function getSelectedEngineName() {
    //return 'phpdoc-md'
    return core_1.getInput('engine');
}
exports.getSelectedEngineName = getSelectedEngineName;
/**
 * Loads action
 *
 * @param string action Action name
 */
async function loadAction(action) {
  const signature = (await Promise.resolve().then(() => __importStar(require(`./actions/${action}`)))).default;
  return new signature();
}
exports.loadAction = loadAction;
/**
 * JSON content cache
 */
let jsonContent = null;
/**
 * Reads package JSON file
 */
function readPackageJSON() {
    if (jsonContent === null) {
        const filename = path_1.default.resolve(__dirname, '..', 'package.json');
        const contentText = fs_1.readFileSync(filename).toString();
        jsonContent = JSON.parse(contentText);
    }
    return jsonContent;
}
exports.readPackageJSON = readPackageJSON;
/**
 * Gets actions names defined in package.json
 */
function getActionsNames() {
    return readPackageJSON().actions;
}
exports.getActionsNames = getActionsNames;
/**
 * Get all actions instances
 */
async function getAllActionsInstances() {
  const actions = [];
  for (const name of getActionsNames()) {
    actions.push(await loadAction(name));
  }
  return actions;
}
exports.getAllActionsInstances = getAllActionsInstances;
/**
 * Executes generator
 *
 * @param string generatorName Generator name
 */
async function execGenerator(generatorName) {
  const generator = await makeGeneratorInstance(generatorName);
  validateGenerator(generator);
  const gitInfo = GitInfo_1.default.createInstance();
  const actions = await getAllActionsInstances();
  for (const action of actions) {
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
exports.execGenerator = execGenerator;
