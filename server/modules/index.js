"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_loader_1 = require("zoo.util/lib/module.loader");
const appModules = module_loader_1.Module.withModule(__dirname, [
    module_loader_1.RegExpFilters.module()
], {
    name: "app",
    type: module_loader_1.ModuleType.main,
    scope: module_loader_1.Scope.PUBLIC
});
appModules.load();
module.exports = { appModules };
//# sourceMappingURL=index.js.map