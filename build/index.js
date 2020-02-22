"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const helpers_1 = require("./helpers");
try {
  ;
  (async () => {
    await helpers_1.execGenerator(helpers_1.getSelectedEngineName());
  })();
}
catch (error) {
    core_1.setFailed(error.message);
}
