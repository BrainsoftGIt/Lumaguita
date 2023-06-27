"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteListener = void 0;
const enuns_1 = require("../enuns");
const types_1 = require("../types");
const colors_1 = require("../colors");
const chalk_1 = __importDefault(require("chalk"));
class RouteListener {
    constructor(navigator) {
        this._jumps = [];
        this._navigator = navigator;
        this._navigator.context.connector.onConnectionListener(socket => {
            this.register(socket);
        });
    }
    get jumps() { return this._jumps; }
    toSource(jump) {
        return {
            cluster_identifier: jump.id,
            cluster_name: jump.name,
            cluster_path: jump.path
        };
    }
    describe() {
        console.log(`TABLE ROUTE ON ${colors_1.colors.identifier(this._navigator.context.id)}`);
        console.table(this._jumps);
    }
    servers() {
        return this._jumps.filter(value => value.source && value.source.includes("SERVER"));
    }
    clients() {
        return this._jumps.filter(value => value.source && value.source.includes("CLIENT"));
    }
    registerJump(map) {
        if (!map.id || !map.linkId)
            throw new Error("Jump Map Mall Formated");
        this._jumps.push(map);
    }
    rememberJumpForm(source, propagation) {
        let actualOrigin = this._jumps.filter(value => value.linkId === source.cluster_identifier);
        let news = propagation.jumps.filter(newValue => !actualOrigin.find(find => find.id === newValue.id));
        let oldKeeps = propagation.jumps.filter(newValue => actualOrigin.find(find => find.id === newValue.id));
        let final = this._jumps.filter(value => value.linkId !== source.cluster_identifier);
        news.forEach(value => { value.source = null; });
        oldKeeps.push(...news);
        oldKeeps.forEach(nextJump => {
            nextJump.linkId = source.cluster_identifier;
            nextJump.type = "remote";
            nextJump.linkType = "REMOTE";
            nextJump.connection = "REMOTE";
        });
        this._jumps.splice(0, this._jumps.length);
        this._jumps.push(...final, ...oldKeeps);
    }
    unregisterJump(source) {
        this._jumps.splice(this._jumps.findIndex(value => value.id === source.cluster_identifier), 1);
    }
    start(event, destine, ...data) {
        const route = {
            event: event,
            route: [],
            destine: destine,
            preview: null,
            origin: this._navigator.context.origin()
        };
        return this.nextJump(route, ...data);
    }
    register(socket) {
        const self = this;
        socket.on(enuns_1.ClusterEvent.JUMP, (route, ...data) => {
            self.nextJump(route, ...data);
        });
    }
    nextJump(route, ...data) {
        const direction = this._jumps.find(value => {
            return value.id === route.destine.cluster_identifier;
        });
        if (!direction) {
            console.log(`${chalk_1.default.redBright.underline("UNDETERMINED DIRECTION:")} ON ${this._navigator.context.id} FROM ${colors_1.colors.identifier(route.origin.cluster_identifier)} TO ${colors_1.colors.identifier(route.destine.cluster_identifier)}`);
            this._navigator.notifyOnUndeterminedDirection(route, ...data);
            return;
        }
        let nextJump, event;
        if ((direction === null || direction === void 0 ? void 0 : direction.linkType) === "REMOTE") {
            nextJump = direction.linkId;
            event = enuns_1.ClusterEvent.JUMP;
        }
        else {
            nextJump = direction.id;
            event = route.event;
        }
        let connection = this._navigator.context.connector.of(nextJump); //this._connections.find( node =>  node.id === nextJump );
        if (connection) {
            route.route.push(this._navigator.context.id);
            route.preview = this._navigator.context.origin();
            connection.emit(event, route, ...data);
            let jumpMode = event === route.event ? "FOUND" : "CONTINUE";
            console.log(`${colors_1.colors.event(enuns_1.ClusterEvent.JUMP)}:${colors_1.colors.name(jumpMode)}\\${colors_1.colors.event(route.event)} ON ${(0, types_1.identifierOf)(this._navigator.context.localCluster)} FROM ${(0, types_1.identifierOf)(route.origin)} TO ${(0, types_1.identifierOf)(route.destine)} USING ${colors_1.colors.action(direction.linkType === "DIRECT", direction.linkType, direction.linkType)} JUMP ${(0, types_1.identifierOf)(nextJump)}`);
        }
        else
            console.error(new Error(`Route not found TO ${colors_1.colors.identifier(route.destine.cluster_identifier)} USING ${this._jumps.join(", ")}`));
        return connection;
    }
}
exports.RouteListener = RouteListener;
//# sourceMappingURL=route.listener.js.map