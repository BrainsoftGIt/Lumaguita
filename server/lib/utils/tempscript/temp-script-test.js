"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support").install();
const index_1 = require("./index");
const win32_engine_1 = require("./engines/win32.engine");
const tempScript = new index_1.TempScript(win32_engine_1.win32TempScriptEngine);
tempScript.command("explorer")
    .env("PGPASSWORD", "1234")
    .path("c:/ssd/fd");
console.log(tempScript.script.raw);
//# sourceMappingURL=temp-script-test.js.map