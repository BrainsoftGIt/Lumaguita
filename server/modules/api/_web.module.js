"use strict";
const { Module, RegExpFilters, Scope, ModuleType } = require('zoo.util/lib/module.loader');
const appModules = Module.withModule(__dirname, [
    RegExpFilters.module(),
    RegExpFilters.route({ level: '*' }),
    RegExpFilters.listener(),
    RegExpFilters.event()
], {
    name: "web",
    type: ModuleType.main,
    scope: Scope.PUBLIC
});
appModules.load();
module.exports = { appModules };
//# sourceMappingURL=_web.module.js.map