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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevisionAgent = void 0;
const sizeof_1 = __importDefault(require("sizeof"));
const types_1 = require("../types");
const enuns_1 = require("../enuns");
const revision_listener_1 = require("../listeners/revision.listener");
const colors_1 = require("../colors");
class RevisionAgent {
    constructor(server) {
        this._onRRListener = new Proxy([], {
            get(target, p, receiver) {
                let value = target[p];
                if (!value)
                    target[p] = value = [];
                return value;
            }
        });
        this._onceRRListener = new Proxy([], {
            get(target, p, receiver) {
                let value = target[p];
                if (!value)
                    target[p] = value = [];
                return value;
            }
        });
        this._revisionIgnore = [];
        this._context = server;
        new revision_listener_1.RevisionListener(this);
    }
    get context() { return this._context; }
    notifyAllClient(metadata, ...args) {
        this.context.navigator.emitToAllClient(enuns_1.ClusterEvent.REVISION, metadata, ...args);
    }
    requestAllServer(metadata, ...args) {
        this._context.navigator.route.servers().forEach(value => {
            this.requestRevision(this.context.navigator.route.toSource(value), metadata, ...args);
        });
    }
    notifyRevision(recClient, metadata, ...args) {
        this._context.navigator.start(enuns_1.ClusterEvent.REVISION, recClient, metadata, ...args);
    }
    requestRevisionRepeat(revServer, req) {
        this._context.service.acceptRevision(revServer).then(clusters => {
            console.table(clusters.filter(value => value.cluster_identifier == revServer.cluster_identifier));
            if (!clusters || clusters.length < 1)
                return;
            req.clusters = clusters;
            this._context.navigator.start(enuns_1.ClusterEvent.REVISION_REQUEST, revServer, req);
        });
        console.log("REPEAT REQUEST REVISION");
    }
    requestRevision(revServer, metadata, ...args) {
        this._context.service.acceptRevision(revServer).then(clusters => {
            if (!clusters || clusters.length < 1)
                return;
            const req = {
                clusters: clusters,
                metadata: metadata,
                repeat: 0,
                args: args,
                limit: this.context.revisionsLimit,
                request: Object.assign(Object.assign({}, this.context.origin()), { cluster_grants: this._context.localCluster.cluster_grants })
            };
            this._context.navigator.start(enuns_1.ClusterEvent.REVISION_REQUEST, revServer, req);
            console.log("SEND CURRENT STATUS");
        });
    }
    sendRevision(revClient, req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let min = 1000000;
            let max = 9999999;
            const revisionConde = Math.trunc(Math.random() * (max - min) + min);
            const revisions = yield this._context.service.pushTo(req);
            //language=file-reference
            if (!(revisions === null || revisions === void 0 ? void 0 : revisions.length) || (revisions === null || revisions === void 0 ? void 0 : revisions.length) === 0) {
                let res = {
                    objects: [],
                    ignores: [],
                    resume: [],
                    total: 0,
                    rejected: 0,
                    limit: req.limit,
                    server: this.context.origin(),
                    revCode: revisionConde,
                    result: []
                };
                this._context.navigator.start(enuns_1.ClusterEvent.REVISION_SEND, req.request, res, req);
                return;
            }
            let regclassInRevision = [];
            let result = [];
            let _resume_class = [];
            revisions.forEach(object => {
                if (!regclassInRevision.includes(object._regclass))
                    regclassInRevision.push(object._regclass);
                let res = _resume_class.find(value => value.class === object._regclass);
                if (!res)
                    _resume_class.push({ class: object._regclass, total: 1, ignores: 0 });
                else
                    res.total++;
                let cluster = result.find(cluster => cluster.cluster_identifier = object._origin_identifier);
                if (!cluster)
                    result.push(cluster = {
                        cluster_identifier: object._origin_identifier,
                        cluster_version: object.object_origincver,
                        cluster_sequence: object.object_seq
                    });
                if (cluster && cluster.cluster_sequence < object.object_seq)
                    cluster.cluster_sequence = object.object_seq;
                if (cluster && cluster.cluster_version < object.object_origincver)
                    cluster.cluster_sequence = object.object_seq;
            });
            //Preparar os rejeitadores de revisãos que lidam com essas revisões
            let prepared = [];
            for (let i = 0; i < this._revisionIgnore.length; i++) {
                let value = this._revisionIgnore[i];
                let _prepared;
                if (!value.evaluates || ((_a = value === null || value === void 0 ? void 0 : value.evaluates) === null || _a === void 0 ? void 0 : _a.find(next => regclassInRevision.includes(next)))) {
                    _prepared = yield value.prepare(regclassInRevision, req, this.context.localCluster, this.context.masterCluster, revisions);
                    prepared.push({
                        validator: value,
                        preparation: _prepared
                    });
                }
            }
            const ignores = [];
            let acceptRevision = [];
            for (let i = 0; i < revisions.length; i++) {
                let next = revisions[i];
                let rejected = false;
                let last;
                for (let i = 0; i < prepared.length; i++) {
                    let pre = prepared[i];
                    if (!!pre.validator.evaluates && !pre.validator.evaluates.includes(next._regclass))
                        continue;
                    rejected = yield pre.validator.reject(pre.preparation, next._regclass, next);
                    last = i;
                    if (rejected)
                        break;
                }
                prepared.filter((value, index) => index > last && rejected).forEach(value => value.validator.onRejected(rejected, value.preparation, next._regclass, next));
                if (rejected) {
                    ignores.push({
                        object: next.object_uid,
                        collector: next.collector_uid,
                        transaction: next.collector_transuid,
                        origin: next._origin_identifier,
                    });
                    let res = _resume_class.find(value => value.class == next._regclass);
                    if (res)
                        res.ignores++;
                }
                let accept = !rejected;
                if (accept)
                    acceptRevision.push(next);
            }
            let res = {
                objects: acceptRevision,
                ignores: ignores,
                resume: _resume_class,
                total: revisions.length,
                rejected: revisions.length - acceptRevision.length,
                limit: req.limit,
                server: this.context.origin(),
                revCode: revisionConde,
                result
            };
            //REDUCER DATA BEFORE SENT
            let initialSize = sizeof_1.default.sizeof(res.objects, true);
            // res.objects = dynamicReducer( res.objects );
            let reducedSize = sizeof_1.default.sizeof(res.objects, true);
            this._context.navigator.start(enuns_1.ClusterEvent.REVISION_SEND, req.request, res, req);
            console.log(`${colors_1.colors.event("SEND")} ${acceptRevision.length} TO ${(0, types_1.identifierOf)(req.request)} NEWS REVISIONS REDUCED WITH INITIAL SIZE: ${colors_1.colors.name(initialSize)} TO REDUCED SIZE: ${colors_1.colors.name(reducedSize)}`);
        });
    }
    applyReceiveRevision(route, res, req) {
        let reducedSize = sizeof_1.default.sizeof(res.objects, true);
        // res.objects = dynamicExpander<ObjectRevision[]>( res.objects );
        let expandedSize = sizeof_1.default.sizeof(res.objects, true);
        if (!(res === null || res === void 0 ? void 0 : res.total) || res.total === 0) {
            this.notifyRevisionReceived(route, req, res, {
                revisions: res.objects,
                status: res.result
            });
            return;
        }
        console.log(`${colors_1.colors.event("RECEIVER")} ${res.objects.length} FROM ${(0, types_1.identifierOf)(route.origin)} NEWS REVISIONS EXPANDED WITH REDUCED SIZE: ${colors_1.colors.name(reducedSize)} TO EXPANDED SIZE: ${colors_1.colors.name(expandedSize)}`);
        this._context.service.pullFrom(res).then(result => {
            console.log(`${colors_1.colors.event("RECEIVER PULL")} ${result.revisions.length} FROM ${(0, types_1.identifierOf)(route.origin)} NEWS REVISIONS EXPANDED WITH REDUCED SIZE: ${colors_1.colors.name(reducedSize)} TO EXPANDED SIZE: ${colors_1.colors.name(expandedSize)}`);
            //Has resource
            result.revisions.filter(value => value._regclass === "cluster.resource")
                .forEach((value, index) => {
                setTimeout(() => this.context.res.download(route.origin, value, value.collector_metadata), 1500 * index);
            });
            if (res.total === req.limit) {
                req.repeat = req.repeat + 1;
                this.requestRevisionRepeat(res.server, req);
            }
            else {
                this.context.service.status().then(clustersStatus => {
                    let { objects } = res, result = __rest(res, ["objects"]);
                    result["status"] = clustersStatus;
                    this._context.navigator.start(enuns_1.ClusterEvent.REVISION_RECEIVED, res.server, result);
                });
            }
            this.notifyRevisionReceived(route, req, res, result);
        }).catch(reason => console.error(reason));
    }
    registerRevisionIgnore(ignore) {
        this._revisionIgnore.push(ignore);
    }
    //Listeners
    notifyRevisionReceived(route, req, res, result) {
        if (!req.metadata)
            return;
        let events = (typeof req.metadata.event === "string") ? [req.metadata.event] : req.metadata.event;
        events.forEach((eventName, index) => {
            this._onRRListener[eventName].forEach((revisionCallback) => {
                revisionCallback(req.metadata, result.revisions, req, res, result);
            });
        });
        events.forEach((eventName, index) => {
            this._onceRRListener[eventName].splice(0).forEach((revisionCallback) => {
                revisionCallback(req.metadata, result.revisions, req, res, result);
            });
        });
    }
    onReceiverRevision(EVENT_NAME, callback) {
        if (typeof EVENT_NAME === "string")
            EVENT_NAME = [EVENT_NAME];
        EVENT_NAME.forEach((value, index) => {
            this._onRRListener[value].push(callback);
        });
    }
    onceReceiverRevision(EVENT_NAME, callback) {
        if (typeof EVENT_NAME === "string")
            EVENT_NAME = [EVENT_NAME];
        EVENT_NAME.forEach((value, index) => {
            this._onceRRListener[value].push(callback);
        });
    }
}
exports.RevisionAgent = RevisionAgent;
//# sourceMappingURL=RevisionAgent.js.map