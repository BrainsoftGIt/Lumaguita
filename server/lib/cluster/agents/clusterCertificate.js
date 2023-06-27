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
exports.ClusterCertificate = void 0;
const server_1 = require("../server");
class ClusterCertificate {
    constructor(context) {
        this._type = server_1.ClusterLevelType.UNKNOWN;
        this._context = context;
    }
    get levelType() {
        return this._type;
    }
    get isVerified() { return this._type !== server_1.ClusterLevelType.UNKNOWN; }
    get isTrunc() { return this._type === server_1.ClusterLevelType.TRUNC; }
    get isRoot() { return this._type === server_1.ClusterLevelType.ROOT; }
    get isUnknown() { return this._type === server_1.ClusterLevelType.UNKNOWN; }
    certificate() {
        return __awaiter(this, void 0, void 0, function* () {
            this.certificate = () => { return Promise.resolve(null); };
            if (this._type !== server_1.ClusterLevelType.UNKNOWN)
                return Promise.resolve(this._type);
            let max = 9999999999;
            let min = 1000000000;
            let domainCode = `DOMAIN-CODE:${Math.trunc(Math.random() * (max - min) + min)}`;
            const _childRejection = (socket, next) => {
                if (this._type === server_1.ClusterLevelType.UNKNOWN) {
                    socket.on("cluster-verification", args => {
                        socket.emit("cluster-verification", domainCode);
                    });
                    next();
                }
                else
                    next(new Error(`this domain is verified as ${this._type}`));
            };
            // this._context.ofRejection().use( _childRejection );
            this._type = yield (new Promise((resolve, reject) => {
                if (this._context.configs.masterDomain)
                    resolve(server_1.ClusterLevelType.ROOT);
                else
                    resolve(server_1.ClusterLevelType.TRUNC);
                // const connect = client.io( `${ this._context.configs.masterDomain }${ this._context.configs.namespaceChecker}`, {
                //     path: this._context.configs.path
                // }).on( "cluster-verification", args => {
                //     resolve( args && args === domainCode? ClusterLevelType.ROOT: ClusterLevelType.TRUNC );
                //     connect.disconnect();
                // }).on( "connect_error", ()=>{
                //     connect.disconnect();
                //     resolve( ClusterLevelType.TRUNC );
                // }).emit( "cluster-verification" );
            }));
            this.certificate = () => { return Promise.resolve(this._type); };
            return Promise.resolve(this._type);
        });
    }
}
exports.ClusterCertificate = ClusterCertificate;
//# sourceMappingURL=clusterCertificate.js.map