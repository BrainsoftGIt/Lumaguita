import {VERSION} from "../../version";
import moment from "moment";

let randomMin = 100000000;
let randomMax = 999999999;

let random = Math.trunc(Math.random()* ( randomMax - randomMin )) + randomMin;
export const E_TAG_VERSION = `${moment().format("YYYY_MM_DD-HH_mm_ss_SSS")}-v${VERSION.NUMBER}-${random}`;
