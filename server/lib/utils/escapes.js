"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeSpaceQuotes = void 0;
function escapeSpaceQuotes(string, force) {
    string = `${string}`;
    string = string.trim();
    string = string.replace(/"/g, '""');
    if (string.match(/ /g)
        || string.match(/"/g)
        || string.match(/'/g)
        || string.match(/,/g)
        || string.match(/;/g))
        string = `"${string}"`;
    if (force && string.charAt(0) !== '"')
        string = `"${string}"`;
    return string;
}
exports.escapeSpaceQuotes = escapeSpaceQuotes;
//# sourceMappingURL=escapes.js.map