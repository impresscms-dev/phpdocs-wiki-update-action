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
function makeGeneratorInstance(engineName) {
    return __awaiter(this, void 0, void 0, function* () {
        const signature = (yield Promise.resolve().then(() => __importStar(require(`./generators/${engineName}`)))).default;
        return new signature();
    });
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
function loadAction(action) {
    return __awaiter(this, void 0, void 0, function* () {
        const signature = (yield Promise.resolve().then(() => __importStar(require(`./actions/${action}`)))).default;
        return new signature();
    });
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
function getAllActionsInstances() {
    return __awaiter(this, void 0, void 0, function* () {
        let actions = [];
        for (const name of getActionsNames()) {
            actions.push(yield loadAction(name));
        }
        return actions;
    });
}
exports.getAllActionsInstances = getAllActionsInstances;
