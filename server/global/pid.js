"use strict";
// process.stdin.resume();//so the program will not close instantly
Object.defineProperty(exports, "__esModule", { value: true });
exports.onExitSignal = exports.showUncaughtError = exports.captureKill = exports.captureCtrlC = exports.captureExits = exports.captureAllExits = exports.captureEventsExits = void 0;
const sys_1 = require("./sys");
const exitCallbackList = [];
let status = {
    captureCtrlC: false,
    captureKill: false,
    captureExits: false
};
function exitHandler(options, exitCode) {
    if (options.cleanup)
        exitCallbackList.forEach(callback => {
            callback(exitCode);
        });
    if (exitCode || exitCode === 0)
        console.log(exitCode);
    sys_1.sys.exit();
}
function captureEventsExits() {
    captureExits();
    captureKill();
}
exports.captureEventsExits = captureEventsExits;
function captureAllExits() {
    captureExits();
    captureCtrlC();
    captureKill();
}
exports.captureAllExits = captureAllExits;
function captureExits() {
    if (status.captureExits)
        return;
    //do something when app is closing
    process.on('exit', exitHandler.bind(null, { cleanup: true }));
    status.captureExits = true;
}
exports.captureExits = captureExits;
function captureCtrlC() {
    if (status.captureCtrlC)
        return;
    //catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }));
    status.captureCtrlC = true;
}
exports.captureCtrlC = captureCtrlC;
function captureKill() {
    if (status.captureKill)
        return;
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
    status.captureKill = true;
}
exports.captureKill = captureKill;
function showUncaughtError() {
    process.on('unhandledRejection', (reason, p) => {
        console.log("[[================ Unhandled Rejection at Promise ================");
        console.error(reason, p);
        console.log("================ Unhandled Rejection at Promise ================]]");
    });
    process.on('uncaughtException', err => {
        console.log("[[================ Uncaught Exception thrown ================");
        console.error(err);
        console.log("================ Uncaught Exception thrown ================]]");
    });
}
exports.showUncaughtError = showUncaughtError;
function onExitSignal(...exitCallback) {
    exitCallbackList.push(...exitCallback);
}
exports.onExitSignal = onExitSignal;
//# sourceMappingURL=pid.js.map