"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alterFormatDate = exports.formattedString = void 0;
function formattedString(nStr) {
    var num = nStr.replace(/(\s)/g, '');
    num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
    return num.includes(".") ? num : num + ",00";
}
exports.formattedString = formattedString;
function alterFormatDate(date) {
    return date.split("-").reverse().join("-");
}
exports.alterFormatDate = alterFormatDate;
//# sourceMappingURL=formatValue.js.map