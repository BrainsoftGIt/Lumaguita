"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AioAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const index_1 = require("./index");
class AioAPI {
    constructor(opts) {
        this.agents = [];
        this.resolvers = [];
        this.applications = [];
        this.ports = [];
        this.options = opts;
        this.agentAPI = opts === null || opts === void 0 ? void 0 : opts.agentAPI;
        if (this.agentAPI)
            this.url = `http://127.0.0.1:${this.agentAPI}`;
        this.webProtocol = "http";
    }
    getAgent(identifier) {
        return new Promise((resolve) => {
            if (!this.agentAPI)
                return resolve(null);
            if (!this.url)
                return resolve(null);
            let _parts = identifier.split(".");
            if (_parts[_parts.length - 1] !== "aio")
                _parts.push("aio");
            if (_parts.length < 2)
                return null;
            identifier = _parts.join(".");
            let _agent = this.agents[identifier];
            if (_agent)
                return resolve(_agent);
            axios_1.default.get(`${this.url}/api/agent/${identifier}`).then(value => {
                if (value.status !== 200)
                    return resolve(null);
                if (!value.data.success)
                    return resolve(null);
                _agent = value.data.data;
                this.agents[identifier] = _agent;
                return resolve(_agent);
            }).catch(reason => {
                console.log("[MAGUITA] ANCHORIO API>", `Error to get agent ${identifier} ${reason["message"]} `);
                resolve(null);
            });
        });
    }
    getDomain(server) {
        return new Promise((resolve) => {
            if (!this.agentAPI)
                return resolve(null);
            if (!this.url)
                return resolve(null);
            let _server = this.agents[server];
            if (_server)
                return resolve(_server);
            axios_1.default.get(`${this.url}/api/domain/${server}`).then(value => {
                if (value.status !== 200)
                    return resolve(null);
                if (!value.data.success)
                    return resolve(null);
                let answer = value.data.data;
                if (!Array.isArray(answer) || !answer.length)
                    return resolve(null);
                _server = answer[0];
                this.agents[server] = _server;
                return resolve(_server);
            }).catch(reason => {
                console.log("[MAGUITA] ANCHORIO API>", `Error to get domain ${server} ${reason["message"]} `);
                resolve(null);
            });
        });
    }
    getApplication(application) {
        return new Promise((resolve) => {
            if (!this.agentAPI)
                return resolve(null);
            if (!this.url)
                return resolve(null);
            let _app = this.applications[application];
            if (_app)
                return resolve(_app);
            axios_1.default.get(`${this.url}/api/app/${application}`).then(value => {
                if (value.status !== 200)
                    return resolve(null);
                if (!value.data.success)
                    return resolve(null);
                _app = value.data.data;
                this.agents[application] = _app;
                return resolve(_app);
            }).catch(reason => {
                console.log("[MAGUITA] ANCHORIO API>", `Error to get application ${application} ${reason["message"]} `);
                resolve(null);
            });
        });
    }
    needPorts() {
        let _api = "/api/ports";
        return new Promise((resolve) => {
            if (!this.agentAPI)
                return resolve(null);
            if (!this.url)
                return resolve(null);
            axios_1.default.get(`${this.url}${_api}`, {
                data: { ports: this.ports }
            }).then(value => {
                if (value.status !== 200)
                    return resolve(null);
                if (!value.data.success)
                    return resolve(null);
                let _port = value.data.data.port;
                this.ports = value.data.data.ports;
                return resolve(_port);
            }).catch(reason => {
                console.log("[MAGUITA] ANCHORIO API>", `Error to get ports  ${reason["message"]} `);
                resolve(null);
            });
        });
    }
    createApplication(application, port, host) {
        return new Promise((resolve) => {
            if (!this.agentAPI)
                return resolve(null);
            if (!this.url)
                return resolve(null);
            let _app = this.applications[application];
            if (_app)
                return resolve(_app);
            axios_1.default.post(`${this.url}/api/app/${application}`, { port: port, host: host }, {
                headers: { "content-type": "application/json" }
            }).then(value => {
                if (value.status !== 200)
                    return resolve(null);
                if (!value.data.success)
                    return resolve(null);
                _app = value.data.data;
                this.agents[application] = _app;
                return resolve(_app);
            }).catch(reason => {
                console.log("[MAGUITA] ANCHORIO API>", `Error to create application ${application} ${reason["message"]} `);
                resolve(null);
            });
        });
    }
    webTarget(server, application) {
        return new Promise((resolve, reject) => {
            var _a, _b, _c, _d;
            Promise.all([
                (_b = (_a = index_1.aioService === null || index_1.aioService === void 0 ? void 0 : index_1.aioService.api) === null || _a === void 0 ? void 0 : _a.getAgent) === null || _b === void 0 ? void 0 : _b.call(_a, server),
                (_d = (_c = index_1.aioService === null || index_1.aioService === void 0 ? void 0 : index_1.aioService.api) === null || _c === void 0 ? void 0 : _c.getDomain) === null || _d === void 0 ? void 0 : _d.call(_c, application)
            ]).then(response => {
                let [_agent, _domain] = response;
                if (!_agent || !_domain)
                    return resolve(null);
                // let target = `${this.webProtocol}://${ _domain.address }:${ aioService.aioAgentPort }`;
                return resolve({ address: _domain.address, protocol: this.webProtocol });
            }).catch(reason => {
                console.log(reason);
                resolve(null);
            });
        });
    }
}
exports.AioAPI = AioAPI;
//# sourceMappingURL=api.js.map