"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbUpgrade = void 0;
const arguments_1 = require("zoo.util/lib/arguments");
require('source-map-support').install();
const json5_1 = __importDefault(require("json5"));
const fs_1 = __importDefault(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
function dbUpgrade(opts) {
    const base = path.dirname(opts.main);
    const line = new arguments_1.Arguments(true);
    line.define({ name: "upgrade", type: Boolean, value: false });
    const upgradeArgs = line.values;
    let main = json5_1.default.parse(fs_1.default.readFileSync(opts.main).toString("utf-8"));
    const dist = path.join(base, main.dist);
    fs_1.default.mkdirSync(dist, { recursive: true });
    let upgrade;
    if (fs_1.default.existsSync(path.join(dist, 'upgrade.json5'))) {
        upgrade = json5_1.default.parse(fs_1.default.readFileSync(path.join(dist, 'upgrade.json5')).toString("utf-8"));
    }
    if (!upgrade)
        upgrade = {};
    if (!upgrade.version)
        upgrade.version = 0;
    if (!upgrade.applied)
        upgrade.applied = [];
    upgrade.version++;
    const src = path.join(dist, `v${upgrade.version}`, "src");
    const srcFull = path.join(dist, `v${upgrade.version}`, "full");
    fs_1.default.mkdirSync(path.join(src), { recursive: true });
    fs_1.default.mkdirSync(path.join(srcFull), { recursive: true });
    const streams = {
        version: fs_1.default.createWriteStream(path.join(dist, `v${upgrade.version}`, `up.full.sql`), { encoding: "utf-8" }),
        fullVer: fs_1.default.createWriteStream(path.join(dist, `v${upgrade.version}`, "up.sql"), { encoding: "utf-8" })
    };
    const map = main.order.map(ref => {
        return {
            path: path.join(base, ref),
            name: path.basename(ref),
            ref: ref,
            verRef: `${ref.split(path.sep).join("/").split("/").join("_-_")}.sql`,
            dir: path.dirname(ref)
        };
    });
    const includes = (sqlFile, iterator, saveStream, dist) => {
        if (!fs_1.default.existsSync(sqlFile.path)) {
            return console.log("File Not Founds", sqlFile.ref);
        }
        const fileName = `sql-v${upgrade.version}-${iterator}-${sqlFile.verRef}`;
        fs_1.default.copyFileSync(sqlFile.path, path.join(dist, fileName));
        saveStream.write(`-- includes ${path.join(`v${upgrade.version}`, fileName)}\n`);
        saveStream.write(`select $$====================[ includes @ref ${path.join(`v${upgrade.version}`, fileName)} ]====================$$;\n`);
        saveStream.write(fs_1.default.readFileSync(sqlFile.path));
        saveStream.write("\n;\n");
    };
    console.log("================= [FULL INCLUDES FILES ] =================");
    map.forEach((sqlFile, index) => {
        includes(sqlFile, index + 1, streams.fullVer, srcFull);
    });
    console.log("================= [NEED INCLUDES FILES ] =================");
    let next = 1;
    let includesFile = [];
    map.forEach((sqlFile, index) => {
        let __included = upgrade.applied.includes(sqlFile.ref) && main.oneShot.includes(sqlFile.ref) && fs_1.default.existsSync(sqlFile.ref);
        includesFile.push({ ref: sqlFile.verRef, includes: !__included, exists: fs_1.default.existsSync(sqlFile.ref) });
        if (__included)
            return;
        includes(sqlFile, next++, streams.version, src);
    });
    map.forEach(sqlFile => {
        if (!upgrade.applied.includes(sqlFile.ref))
            upgrade.applied.push(sqlFile.ref);
    });
    fs_1.default.writeFileSync(path.join(dist, "upgrade.json5"), json5_1.default.stringify(upgrade, null, 2));
    streams.version.close();
    streams.fullVer.close();
    streams.version.on("close", () => {
        fs_1.default.copyFileSync(streams.version.path, path.join(dist, 'upgrade.sql'));
        fs_1.default.writeFileSync(path.join(dist, `v${upgrade.version}`, `up.json5`), json5_1.default.stringify(Object.assign({
            includes: includesFile
        }, upgrade), null, 2));
        console.log("=============================================== [ RESUME ] ===============================================");
        console.log("new upgrade version", streams.version.path);
        console.log("new upgrade fullVer", streams.fullVer.path);
        console.log("new upgrade source", src);
        console.log("new upgrade sqlFile", path.join(dist, 'upgrade.sql'));
        console.log(upgradeArgs);
        if (upgradeArgs.upgrade) {
            const dbConfig = require('../../server/global/autogen/config/db').db.dbConfig;
            const child = (0, child_process_1.spawn)("psql", [
                "-h", "127.0.0.1",
                "-U", dbConfig.user,
                "-p", dbConfig.port,
                "-d", dbConfig.database,
                "-f", path.join(dist, 'upgrade.sql'),
                "-t"
            ], { env: {
                    PGPASSWORD: dbConfig.password
                } });
            child.on("error", err => console.log(err));
            child.stderr.on("error", err => console.error(err));
            child.stdout.on("error", err => console.error(err));
            child.stdout.on("data", chunk => console.log(chunk.toString("utf-8")));
            child.stderr.on("data", chunk => console.log(chunk.toString("utf-8")));
        }
    });
}
exports.dbUpgrade = dbUpgrade;
//database/project/upgrade/dists/release-v3/upgrade.sql
//# sourceMappingURL=up.js.map