"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const GitInfo_1 = __importDefault(require("./GitInfo"));
const helpers_1 = require("./helpers");
try {
    helpers_1.makeGeneratorInstance(helpers_1.getSelectedEngineName()).then((generator) => {
        helpers_1.validateGenerator(generator);
        const gitInfo = GitInfo_1.default.createInstance();
        helpers_1.getAllActionsInstances().then((actions) => {
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
        });
    });
}
catch (error) {
    core_1.setFailed(error.message);
}
