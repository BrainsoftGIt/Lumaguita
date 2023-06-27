export function formattedString(nStr) {
    var num = nStr.replace(/(\s)/g, '');
    num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
    return num.includes(".") ? num : num+",00";
}

export function alterFormatDate(date) {
    return date.split("-").reverse().join("-");
}
