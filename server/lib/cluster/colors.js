"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.colors = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.colors = new class ClusterColors {
    constructor() {
        let sets = this.sets();
        sets.identifier(chalk_1.default.underline.bold.italic.yellowBright);
        sets.name(chalk_1.default.yellow);
        sets.route(chalk_1.default.cyanBright);
        sets.path(chalk_1.default.cyan);
        sets.event(chalk_1.default.magentaBright);
        sets.action(chalk_1.default.greenBright, chalk_1.default.redBright);
        sets.title(chalk_1.default.blueBright.underline);
    }
    identifier(name) { return this._identifier(name); }
    name(name) { return this._name(name); }
    route(name) { return this._route(name); }
    path(name) { return this._path(name); }
    event(name) { return this._event(name); }
    direction(name) { return this._direction(name); }
    title(name) { return this._title(name); }
    action(validator, onTrue, onFalse) {
        if (typeof validator === "function")
            validator = validator();
        if (validator)
            return this._action_success(onTrue);
        else
            return this._action_failed(onFalse);
    }
    sets() {
        const self = this;
        return {
            identifier(color) { self._identifier = color; },
            name(color) { self._name = color; },
            route(color) { self._route = color; },
            path(color) { self._path = color; },
            event(color) { self._event = color; },
            direction(color) { self._direction = color; },
            title(color) { self._title = color; },
            action(success, failed) {
                self._action_success = success;
                self._action_failed = failed;
            }
        };
    }
};
//# sourceMappingURL=colors.js.map