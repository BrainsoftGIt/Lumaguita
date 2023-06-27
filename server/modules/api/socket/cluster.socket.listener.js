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
const cluster_service_1 = require("../../../service/cluster.service");
const branch_ignore_1 = require("../db/branch.ignore");
let conditionalIgnores = [
    'tweeks.branch',
    'auth.colaborador',
    'auth.acesso',
    'tweeks.espaco',
    'tweeks.cambio',
    'tweeks.trabalha'
];
function prepareBranch(req, local, master) {
    const clusterPath = req.request.cluster_path.split("/").filter(value => value && value.length > 0);
    // const result = await
    return (0, branch_ignore_1.branchIgnore)(req).then(result => {
        return Promise.resolve(Object.assign({ local,
            master,
            req,
            clusterPath, clusterPathName: clusterPath.join("/") }, result));
    }).catch(reason => console.error(reason));
}
cluster_service_1.clusterServer.revision.registerRevisionIgnore({
    evaluates: null,
    prepare(rclass, req, local, master, revs) {
        return __awaiter(this, void 0, void 0, function* () {
            return prepareBranch(req, local, master);
        });
    }, reject(prepared, rclass, obj) {
        let ignore = { name: "@ignore/branch" };
        let _branch;
        if (rclass === "tweeks.branch")
            _branch = obj.collector_metadata;
        else if (!obj.collector_metadata["_branch_uid"])
            return;
        else
            _branch = prepared.branchList.find(value => value.branch_uid === obj.collector_metadata["_branch_uid"]);
        if (!_branch)
            return ignore;
        ignore.text = _branch.branch_name;
        ignore["cluster"] = prepared.req.request.cluster_identifier;
        ignore["cluster-in"] = _branch.branch_clusters.join(", ");
        let branchPath = _branch.branch_path.split("/").filter(value => value && value.length > 0);
        let minPath = (prepared.clusterPath.length <= branchPath.length ? prepared.clusterPath.length : branchPath.length) - 1;
        let branchBasePath = branchPath.filter((value, index) => index <= minPath).join("/");
        let branchPathName = branchPath.join("/");
        let clusterBasePath = prepared.clusterPath.filter((value, index) => index <= minPath).join("/");
        //TODO por agora vou ignorar todas as regras de caminho e avaliar pela igualdade
        if (!_branch.branch_clusters.includes(prepared.req.request.cluster_identifier))
            return ignore;
    }, onRejected(rejection, prepared, rclass, obj) {
    }
});
cluster_service_1.clusterServer.revision.registerRevisionIgnore({
    evaluates: ["cluster.resource"],
    prepare(rclass, req, local, master, revs) {
        return __awaiter(this, void 0, void 0, function* () {
            return prepareBranch(req, local, master);
        });
    }, reject(prepared, rclass, obj) {
        var _a, _b, _c;
        if (!this.evaluates.includes(obj._regclass))
            return;
        if (!((_b = (_a = obj.collector_metadata) === null || _a === void 0 ? void 0 : _a.resource_metadata) === null || _b === void 0 ? void 0 : _b._branch_uid))
            return;
        let ignore = { name: "@ignore/branch/resource" };
        let _branch = (_c = prepared.branchList) === null || _c === void 0 ? void 0 : _c.find(value => { var _a, _b; return (value === null || value === void 0 ? void 0 : value.branch_uid) === ((_b = (_a = obj.collector_metadata) === null || _a === void 0 ? void 0 : _a.resource_metadata) === null || _b === void 0 ? void 0 : _b._branch_uid); });
        if (!_branch)
            return ignore;
        if (!_branch.branch_clusters.includes(prepared.req.request.cluster_identifier))
            return ignore;
    }, onRejected(rejection, prepared, rclass, obj) {
    }
});
//# sourceMappingURL=cluster.socket.listener.js.map