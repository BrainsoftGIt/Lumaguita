"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronManager = exports.createExpression = exports.cronFormat = exports.intervalNames = exports.formats = exports.interval = void 0;
const moment_1 = __importDefault(require("moment"));
const node_cron_1 = __importDefault(require("node-cron"));
exports.interval = ["week", "week-day", "day", "month", "hour"];
exports.formats = {
    "week": { format: "e", field: "week" },
    "week-day": { format: "ddd", field: "weekday" },
    "day": { format: "D", field: "day" },
    "month": { format: "MMM", field: "month" },
    "hour": { format: "HH", field: "hour" }
};
function intervalNames(mmt, opts) {
    let prefix = "", suffix = "";
    if (opts.prefix)
        prefix = `[${opts.prefix}]`;
    if (opts.suffix)
        suffix = `[${opts.suffix}]`;
    return exports.interval.map(next => {
        let format = `${prefix}[${next}-]${exports.formats[next].format}${suffix}`;
        let field = exports.formats[next].field;
        let value;
        // @ts-ignore
        if (typeof mmt[field] === "function")
            value = mmt[field]();
        return { value, field, format, intervalName: next };
    });
}
exports.intervalNames = intervalNames;
function simple(simple) {
    if (simple === undefined || simple === null)
        return "*";
    else if (typeof simple === "number")
        return String(simple);
    else if (typeof simple === "string" && simple.length)
        return simple;
    else if (typeof simple === "string" && !simple.length)
        return "*";
    else if (typeof simple === "object" && Array.isArray(simple)) {
        return simple.map((value, index) => {
            return cronFormat(value);
        }).join(",");
    }
    else if (typeof simple === "object") {
        if (!simple)
            return "*";
        else
            return `${cronFormat(simple.start)}-${cronFormat(simple.end)}`;
    }
}
function cronFormat(exp) {
    if (!exp)
        return "*";
    if (typeof exp === "object" && (exp["in"] || exp["repeat"])) {
        return `${simple(exp["in"])}/${exp["repeat"]}`;
    }
    else {
        // @ts-ignore
        return simple(exp);
    }
}
exports.cronFormat = cronFormat;
const intervals = ["minute", "hour", "day", "month", "week"];
function createExpression(opts) {
    if (!opts)
        opts = {};
    intervals.forEach((key, index) => {
        opts[key] = cronFormat(opts[key]);
    });
    return intervals.map(key => opts[key]).join(" ");
}
exports.createExpression = createExpression;
const services = {};
exports.cronManager = {
    register(name, opts, callback) {
        let _opts;
        if (typeof opts === "function") {
            callback = opts;
            _opts = {};
        }
        else {
            _opts = opts;
        }
        if (typeof callback !== "function")
            throw new Error("Invalid cron callback!");
        if (services[name]) {
            services[name].task.stop();
        }
        let expression;
        if (typeof _opts === "string")
            expression = _opts;
        else
            expression = createExpression(_opts);
        console.log(`[MAGUITA] Cron> service ${name} ->> ${expression}...`);
        const _service = {
            callback,
            task: node_cron_1.default.schedule(expression, () => {
                if (typeof _service.callback !== "function")
                    return;
                _service.callback((0, moment_1.default)(new Date()));
            }),
            expression,
            name,
            opts: _opts
        };
        services[name] = _service;
        console.log(`[MAGUITA] Cron> service ${name} ->> ${expression}... CREATED REGISTERED STARTED!`);
        return services[name];
    }, getService(name) {
        return services[name];
    }, start(name) {
        const _service = services[name];
        if (!_service)
            return;
        console.log(`[MAGUITA] Cron> service ${name} ->> ${_service.expression}... START!`);
        return _service.task.start();
    }, restart(name) {
        const _service = services[name];
        if (!_service)
            return;
        console.log(`[MAGUITA] Cron> service ${name} ->> ${_service.expression}... RESTART!`);
        return _service.task.stop().start();
    }, play(name) {
        const _service = services[name];
        if (!_service)
            return;
        console.log(`[MAGUITA] Cron> service ${name} ->> ${_service.expression}... PLAY-NOW!`);
        return _service.callback((0, moment_1.default)(new Date()));
    }, stopService(name) {
        const _service = services[name];
        if (!_service)
            return;
        console.log(`[MAGUITA] Cron> service ${name} ->> ${_service.expression}... STOPPED!`);
        return _service.task.stop();
    }, stopAllService() {
        return Object.keys(services).map(key => services[key].task)
            .map(value => value.stop());
    }, startAll() {
        return Object.keys(services).map(key => services[key].task)
            .map(value => value.start());
    }, unRegister(serviceName) {
        let _service = services[serviceName];
        if (!_service)
            return;
        console.log(`[MAGUITA] Cron> service ${serviceName} ->> ${_service.expression}... UNREGISTERED!`);
        _service.task.stop();
        delete services[serviceName];
    }, existsService(serviceName) {
        return !!services[serviceName];
    }
};
//# sourceMappingURL=index.js.map