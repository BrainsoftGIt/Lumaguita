"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLine = void 0;
const args_1 = require("../../global/args");
const commands = new Proxy([], {
    get(target, p, receiver) {
        if (!target[p])
            target[p] = [];
        return target[p];
    }
});
const commandsName = [];
if (!args_1.args.appNoCli) {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        let find = false;
        let parts = line.split(" ").filter(value => value.length > 0);
        let command = parts.shift();
        if (!command)
            command = "";
        commands[command].forEach(callback => {
            // @ts-ignore
            callback(command, line, ...parts);
            find = true;
        });
        let number = Number(command);
        let int = Number.isSafeInteger(number);
        if (int && number >= 0 && number < commandsName.length && line.length > 0) {
            let name = commandsName[number].name;
            commands[name].forEach(callback => {
                callback(command, line, ...parts);
                find = true;
            });
        }
    });
}
function registerLine(ioName, ioLine) {
    if (!Array.isArray(ioName)) {
        // @ts-ignore
        ioName = [ioName];
    }
    // @ts-ignore
    ioName.forEach((value, index) => {
        if (!value)
            value = "";
        if (typeof value === "string") {
            commands[value].push(ioLine);
            commandsName.push({ name: value, describe: "" });
        }
        else if (value && typeof value === "object") {
            if (!value.name)
                value.name = "";
            // @ts-ignore
            commands[value.name].push(ioLine);
            commandsName.push(value);
        }
    });
}
exports.registerLine = registerLine;
registerLine(["cls", "clear", "clean"], () => {
    console.clear();
});
registerLine(["/?", "?", "help", "/help"], () => {
    console.table(commandsName);
});
//# sourceMappingURL=index.js.map