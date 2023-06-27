"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openWebView = void 0;
const args_1 = require("../../../server/global/args");
function openWebView(document, path, name) {
    let appPort = args_1.args.appPort;
    let _path;
    if (path && path.length) {
        _path = path.split("/").filter(value => value && value.trim());
    }
    if (_path && _path.length) {
        path = ["", ..._path].join("/");
    }
    else
        path = "";
    let webview = `<webview id="webview" src="http://127.0.0.1:${appPort}${path}?launcher=nw.ts" ></webview>`;
    let title = name || document.title || path.split("/").pop();
    document.getElementsByTagName("body").item(0).innerHTML = webview;
    document.title = title;
}
exports.openWebView = openWebView;
//# sourceMappingURL=index.js.map