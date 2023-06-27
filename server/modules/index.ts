import { Module, RegExpFilters, Scope, ModuleType } from "zoo.util/lib/module.loader" ;

const appModules = Module.withModule( __dirname, [
    RegExpFilters.module()
], {
    name: "app",
    type: ModuleType.main,
    scope: Scope.PUBLIC
});

appModules.load();
module.exports = { appModules };
