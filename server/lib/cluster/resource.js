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
exports.Resource = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const enuns_1 = require("./enuns");
const CHUNK_HEAD = "chunk.head";
const PART_EXTENSION = "part";
const CHUNK_NAME = "chunk";
const chunkName = (i) => `${CHUNK_NAME}-${i}`;
const chunkPart = (i) => `${CHUNK_NAME}-${i}.${PART_EXTENSION}`;
class Resource {
    constructor(context) {
        this._context = context;
        this._context.connector.onConnectionListener((socket, cluster, type) => this.share(socket, cluster, type));
        this._context.navigator.onDiscoverListener((jump, type, accept) => {
            if (accept && type === "server")
                this.onDiscoverServer(jump, type, accept);
        });
    }
    onDiscoverServer(jump, type, accept) {
        let source = this._context.navigator.route.toSource(jump);
        this._context.service.loadResourcePendent(source).then((resources) => {
            resources.forEach((value, index) => {
                setTimeout(() => {
                    this.download(source, value, value);
                }, 1500 * index);
            });
        });
    }
    resolveSets(sets, opts) {
        let resolve;
        let mode;
        if (opts === null || opts === void 0 ? void 0 : opts.temp) {
            resolve = path.join(this._context.configs.resourceMountPoint, sets.resource_reference);
            const parts = resolve.split(path.sep);
            resolve = parts.join(path.sep);
            fs.mkdirSync(resolve, { recursive: true });
            mode = "temp";
        }
        else {
            resolve = path.join(this._context.configs.resource, sets.resource_reference);
            let dir = resolve.split(path.sep);
            dir.pop();
            fs.mkdirSync(dir.join("/"), { recursive: true });
            mode = "final";
        }
        const reRes = Object.assign(Object.assign({}, sets), { resolve,
            mode, exists: fs.existsSync(resolve) });
        if (opts === null || opts === void 0 ? void 0 : opts.base) {
            reRes.api = `${opts === null || opts === void 0 ? void 0 : opts.base}/${reRes.resource_url}`;
        }
        return reRes;
    }
    create(args, base) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._context.service.createResource(args).then(value => {
                if (!value || value.length < 1)
                    return Promise.reject(new Error("Resource not create"));
                return Promise.resolve(this.resolveSets(value[0], { base }));
            });
        });
    }
    download(server, object, res) {
        let min = 100000000;
        let max = 999999999;
        let code = Math.trunc((Math.random() * (max - min)) + min);
        if (fs.existsSync(this.resolveSets(res).resolve))
            return;
        let mntResolve = this.resolveSets(res, { temp: code });
        let chunks = fs.readdirSync(mntResolve.resolve).filter(value => {
            let parts = value.split("-");
            if (parts.length !== 2)
                return false;
            let part1 = parts[1].split(".");
            return parts.length === 2
                && part1.length === 2
                && parts[0] === "chunk"
                && part1[1] === "part";
        });
        let req = {
            resource: res,
            chunks: chunks,
            code: code,
            object_ref: object.object_ref,
            collector_transuid: object.collector_transuid,
            object_uid: object.object_uid
        };
        this._context.navigator.start(enuns_1.ClusterEvent.RESOURCE_REQ, server, req);
    }
    upload(client, req) {
        let resolve = this.resolveSets(req.resource);
        if (!resolve.exists) {
            this._context.navigator.start(enuns_1.ClusterEvent.RESOURCE_404, client, req);
            return false;
        }
        const stream = fs.createReadStream(resolve.resolve);
        let i = 1;
        stream.on("data", (chunk) => {
            let index = i - 1;
            let res = {
                chunk: chunk,
                part: i++
            };
            let chunkName = chunkPart(i);
            if (req.chunks.includes(chunkName))
                return;
            setTimeout(() => this._context.navigator.start(enuns_1.ClusterEvent.RESOURCE_CHUNK, client, res, req), (1000 * 1.1 * index) + 1500);
        });
        stream.on("end", () => {
            const res = {
                total: i - 1
            };
            this._context.navigator.start(enuns_1.ClusterEvent.RESOURCE_HEAD, client, res, req);
        });
        return true;
    }
    complete(req, resolve) {
        if (fs.existsSync(this.resolveSets(resolve).resolve))
            return;
        if (!resolve)
            return;
        if (resolve.mode !== "temp")
            return;
        if (!fs.existsSync(path.join(resolve.resolve, CHUNK_HEAD)))
            return;
        let parts = Number(fs.readFileSync(path.join(resolve.resolve, CHUNK_HEAD)));
        for (let i = 1; i <= parts; i++) {
            let chunk = path.join(resolve.resolve, chunkPart(i));
            let exists = fs.existsSync(chunk);
            if (!exists)
                return;
        }
        let final = this.resolveSets(resolve);
        const write = fs.createWriteStream(final.resolve);
        for (let i = 1; i <= parts; i++) {
            let chunk = path.join(resolve.resolve, chunkPart(i));
            let callback = (error) => { };
            if (i === parts)
                callback = (error) => {
                    if (error)
                        return;
                    write.end();
                    this._context.service.setsResourceDownloaded({
                        collector_transuid: req.collector_transuid,
                        object_ref: req.object_ref,
                        object_uid: req.object_uid
                    }).then(value => {
                        fs.rmSync(resolve.resolve, { recursive: true, force: true });
                    });
                };
            write.write(fs.readFileSync(chunk), callback);
        }
    }
    head(head, req) {
        if (fs.existsSync(this.resolveSets(req.resource).resolve))
            return;
        let resolve = this.resolveSets(req.resource, { temp: req.code });
        if (fs.existsSync(path.join(resolve.resolve, CHUNK_HEAD)))
            return;
        fs.writeFileSync(path.join(resolve.resolve, CHUNK_HEAD), `${head.total}`);
        this.complete(req, resolve);
    }
    chunk(res, req) {
        if (fs.existsSync(this.resolveSets(req.resource).resolve))
            return;
        let resolve = this.resolveSets(req.resource, { temp: req.code });
        let chunk = path.join(resolve.resolve, chunkName(res.part));
        let stream = fs.createWriteStream(chunk);
        stream.write(res.chunk, error => {
            fs.rename(chunk, path.resolve(resolve.resolve, chunkPart(res.part)), err => { console.error(err); });
            stream.end();
            this.complete(req, resolve);
        });
    }
    share(socket, cluster, type) {
        socket.on(enuns_1.ClusterEvent.RESOURCE_REQ, (route, req) => {
            console.log("ClusterEvent.RESOURCE_REQ");
            this.upload(route.origin, req);
        });
        socket.on(enuns_1.ClusterEvent.RESOURCE_404, (route, req) => {
            console.log("ClusterEvent.RESOURCE_404", req.resource.resource_url);
        });
        socket.on(enuns_1.ClusterEvent.RESOURCE_CHUNK, (route, res, req) => {
            console.log("ClusterEvent.RESOURCE_CHUNK");
            this.chunk(res, req);
        });
        socket.on(enuns_1.ClusterEvent.RESOURCE_HEAD, (route, head, req) => {
            console.log("ClusterEvent.RESOURCE_HEAD");
            this.head(head, req);
        });
        socket.on(enuns_1.ClusterEvent.RESOURCE_AVAILABLE, (route, resource) => {
            console.log("ClusterEvent.RESOURCE_AVAILABLE");
            this._context.navigator.start(enuns_1.ClusterEvent.RESOURCE_REQ, route.origin, resource);
        });
    }
    listen() {
        return (req, res, next) => {
            let filePath = this.resolve(req.url);
            if (fs.existsSync(filePath))
                res.sendFile(filePath);
            else {
                res.status(404);
                res.sendFile(this._context.configs.resource_404);
            }
        };
    }
    resolve(url) {
        url = url.split("/")
            .filter(value => !!value && value.length > 0).join("/");
        let parts = url.split("/");
        let fileName = parts.pop();
        let fileId = parts.pop();
        let fileRef = `${fileId}-${fileName}`;
        parts.push(fileRef);
        const resolve = parts.join("/");
        let base = this._context.configs.resource;
        return path.join(base, resolve);
    }
}
exports.Resource = Resource;
//# sourceMappingURL=resource.js.map