"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanPostgresRegisters = exports.DEFAULTS_MAP = void 0;
require('source-map-support').install();
exports.DEFAULTS_MAP = ["HKLM\\SOFTWARE\\PostgreSQL", "HKCU\\SOFTWARE\\PostgreSQL"];
function createProcess(callback) {
    let pendents = 0;
    const regedit = require("regedit");
    return {
        start() {
            pendents++;
            return regedit;
        },
        complete: () => {
            pendents--;
            if (pendents === 0)
                callback();
        },
        registers: []
    };
}
function mapEntry(proc, location, path, entryKey) {
    let map = path.split("\\");
    map.push(entryKey);
    proc.start().list(map.join("\\")).on("data", (entry) => {
        var _a;
        if (!entry.data.exists)
            return;
        let map = location === "Installations" ? [
            "Base Directory", "base",
            "Version", "version",
            "Data Directory", "data",
            "Service ID", "service",
            "Super User", "user"
        ] : location === "Services" ? [
            "Data Directory", "data",
            "Port", "port",
            "Database Superuser", "user",
            "Product Code", "service"
        ] : [];
        const values = entry.data.values;
        const reg = {
            type: location,
            entry: entryKey,
            path: entry.key,
        };
        for (let i = 0; i < map.length; i += 2) {
            let key = map[i + 1];
            let code = map[i];
            reg[key] = (_a = values === null || values === void 0 ? void 0 : values[code]) === null || _a === void 0 ? void 0 : _a["value"];
        }
        proc.registers.push(reg);
    }).on("finish", () => {
        proc.complete();
    });
}
function findLocation(proc, path, location) {
    let map = path.split("\\");
    map.push(location);
    proc.start().list(map.join("\\")).on("data", (entry) => {
        if (!entry.data.exists)
            return;
        [...entry.data.keys].forEach(entryName => {
            mapEntry(proc, location, entry.key, entryName);
        });
    }).on("finish", () => {
        proc.complete();
    });
}
//[ 'HKLM\\SOFTWARE\\PostgreSQL', 'HKCU\\SOFTWARE\\PostgreSQL'
function scanPostgresRegisters(...knowsMaps) {
    if (!knowsMaps)
        knowsMaps = exports.DEFAULTS_MAP.map(value => value);
    knowsMaps = exports.DEFAULTS_MAP.filter(value => knowsMaps.includes(value));
    if (!knowsMaps.length)
        knowsMaps = exports.DEFAULTS_MAP.map(value => value);
    return new Promise((resolve) => {
        const proc = createProcess(() => {
            resolve(proc.registers);
        });
        proc.start().list([...knowsMaps]).on("data", (entry) => {
            if (!entry.data.exists)
                return;
            [...entry.data.keys].forEach(location => {
                findLocation(proc, entry.key, location);
            });
        }).on("finish", () => {
            proc.complete();
        });
    });
}
exports.scanPostgresRegisters = scanPostgresRegisters;
//# sourceMappingURL=pg-register.js.map