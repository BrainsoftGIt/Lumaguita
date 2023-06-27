"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterConfigsLoader = void 0;
class ClusterConfigsLoader {
    constructor(server) {
        this._server = server;
    }
    hasLocalChange() {
        return __awaiter(this, void 0, void 0, function* () {
            const newConfigs = yield this._server.service.loadLocalCluster();
            return this._hasChange(newConfigs, this._server.localCluster);
        });
    }
    _hasChange(newConfigs, oldConfigs) {
        const configs = { new: newConfigs, old: oldConfigs };
        const dif = (!configs.old && configs.new) || (configs.old && !configs.new)
            || (JSON.stringify(configs.old) !== JSON.stringify(configs.new));
        if (!dif)
            return { new: null, old: null };
        else
            return configs;
    }
    loadChange() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all([
                this.hasLocalChange(),
                this.hasMasterChange(),
                this._server.service.loadLocalCluster(),
                this._server.service.loadMasterCluster()
            ]).then(value => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                let local = value[0];
                let master = value[1];
                let loadLocal = value[2];
                let loadMaster = value[3];
                if (!!local || !!master) {
                    local = { new: (local === null || local === void 0 ? void 0 : local.new) || this._server.service.currentLocalCluster, old: local === null || local === void 0 ? void 0 : local.old };
                    master = { new: (master === null || master === void 0 ? void 0 : master.new) || this._server.service.currentMasterCluster, old: master === null || master === void 0 ? void 0 : master.old };
                    return Promise.resolve({
                        master: master === null || master === void 0 ? void 0 : master.new,
                        local: local === null || local === void 0 ? void 0 : local.new,
                        connect: master && (master === null || master === void 0 ? void 0 : master.new)
                            && local && (local === null || local === void 0 ? void 0 : local.new)
                            && ((_a = master.new) === null || _a === void 0 ? void 0 : _a.cluster_domain)
                            && ((_b = master === null || master === void 0 ? void 0 : master.new) === null || _b === void 0 ? void 0 : _b.cluster_port)
                            && ((_c = master === null || master === void 0 ? void 0 : master.new) === null || _c === void 0 ? void 0 : _c.cluster_api)
                            && ((_e = (_d = master === null || master === void 0 ? void 0 : master.new) === null || _d === void 0 ? void 0 : _d.cluster_api) === null || _e === void 0 ? void 0 : _e.length) === 128,
                        changeConnect: master && (master === null || master === void 0 ? void 0 : master.new)
                            && local && (local === null || local === void 0 ? void 0 : local.new) && (((_f = master.new) === null || _f === void 0 ? void 0 : _f.cluster_domain) !== ((_g = master.old) === null || _g === void 0 ? void 0 : _g.cluster_domain)
                            || ((_h = master === null || master === void 0 ? void 0 : master.new) === null || _h === void 0 ? void 0 : _h.cluster_port) !== ((_j = master === null || master === void 0 ? void 0 : master.old) === null || _j === void 0 ? void 0 : _j.cluster_port)
                            || ((_k = master === null || master === void 0 ? void 0 : master.new) === null || _k === void 0 ? void 0 : _k.cluster_api) !== ((_l = master === null || master === void 0 ? void 0 : master.old) === null || _l === void 0 ? void 0 : _l.cluster_api)
                            || ((_o = (_m = master === null || master === void 0 ? void 0 : master.new) === null || _m === void 0 ? void 0 : _m.cluster_api) === null || _o === void 0 ? void 0 : _o.length) != ((_q = (_p = master === null || master === void 0 ? void 0 : master.old) === null || _p === void 0 ? void 0 : _p.cluster_api) === null || _q === void 0 ? void 0 : _q.length))
                    });
                }
                else
                    Promise.resolve(null);
            });
        });
    }
    hasMasterChange() {
        return __awaiter(this, void 0, void 0, function* () {
            const newConfigs = yield this._server.service.loadMasterCluster();
            return this._hasChange(newConfigs, this._server.masterCluster);
        });
    }
}
exports.ClusterConfigsLoader = ClusterConfigsLoader;
//# sourceMappingURL=configs.js.map