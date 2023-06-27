"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseResolveAnyParallel = exports.promiseResolveAny = exports.promiseResolve = void 0;
function promiseResolve(promise) {
    return new Promise(resolve => {
        if (promise instanceof Promise)
            promise.then(success => {
                resolve({ success });
            }).catch(error => {
                console.error(error);
                resolve({ error });
            });
        else
            resolve({ success: promise });
    });
}
exports.promiseResolve = promiseResolve;
function promiseResolveAny(...promises) {
    return new Promise(resolve => {
        let _results = [];
        let total = promises.length;
        let __next = (result) => {
            _results.push(result);
            if (promises.length === 0 && total === 1) {
                _results.error = _results[0].error;
                _results.success = _results[0].success;
            }
            if (promises.length === 0)
                return resolve(_results);
            __iterate();
        };
        let __iterate = () => {
            let next = promises.shift();
            next.then(success => __next({ success }))
                .catch(error => __next({ error }));
        };
        __iterate();
    });
}
exports.promiseResolveAny = promiseResolveAny;
function promiseResolveAnyParallel(...promises) {
    return new Promise(resolve => {
        let _results = [];
        let total = promises.length;
        let __next = (result, index) => {
            _results[index] = result;
            if (total === _results.length && total === 1) {
                _results.error = _results[0].error;
                _results.success = _results[0].success;
            }
            if (total === _results.length)
                resolve(_results);
        };
        promises.forEach((value, index) => {
            value.then(success => __next({ success }, index))
                .catch(error => __next({ error }, index));
        });
    });
}
exports.promiseResolveAnyParallel = promiseResolveAnyParallel;
//# sourceMappingURL=promise.js.map