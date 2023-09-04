"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_service_1 = require("../../../../service/storage.service");
const call_function_schedule_1 = require("../../db/clinic/call-function-schedule");
const node_cron_1 = __importDefault(require("node-cron"));
const moment_1 = __importDefault(require("moment"));
const calendar_1 = require("./functions/calendar");
const args_1 = require("../../../../global/args");
let noLoadAlerts = true;
let forceReloadAlerts = false;
let typeEvent = "920eb08f-5f59-47bb-9d48-32da83bf83eb";
let listEventToNotify = [];
let consultaColor = {
    "055f35b5-e5f1-4c66-92f8-3b2fe2362457": "#00FFFF",
    "a7228a44-ea34-42cb-9978-3d5a3f968424": "#00FF00",
    "c16c935a-396a-4191-af39-a731185703d7": "#FF0000",
    "cd5c3c8b-a568-4104-9910-83b8787cc831": "#ffa500",
    "920eb08f-5f59-47bb-9d48-32da83bf83eb": "#800000",
    "7e7628b3-7c92-4765-8bf4-f253b7526ad6": "#800080"
};
storage_service_1.app.get("/api/clinica/calendar", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadScheduler } = require("../../db/clinic/call-function-schedule");
    req.body.schedule_estado = [1];
    let { start, end } = req.query;
    req.body.operation = "RANGE";
    req.body.range_start = start.toString().substring(0, 10);
    req.body.range_end = end.toString().substring(0, 10);
    let response = yield functLoadScheduler(req.body);
    res.json(response.rows.map(({ data }) => {
        data.id = data.schedule_schedule_uuid || data.schedule_uuid;
        data.title = data.schedule_name;
        data.start = data.schedule_startdate;
        data.end = data.schedule_enddate;
        data.color = (consultaColor === null || consultaColor === void 0 ? void 0 : consultaColor[data.schedule_type]) || "Black";
        return data; //{id : data.id, title : data.title, start: data.start, end : data.end}
    }));
}));
storage_service_1.app.post("/api/clinica/calendar/set", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functSetScheduler } = require("../../db/clinic/call-function-schedule");
    req.body.schedule_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.schedule_colaborador_uid = req.session.auth_data.auth.colaborador_id;
    req.body._branch_uid = req.session.auth_data.auth.branch_uuid;
    forceReloadAlerts = true;
    let response = yield functSetScheduler(req.body);
    res.json({ response });
}));
let funLoadSchedules = () => {
    noLoadAlerts = false;
    forceReloadAlerts = false;
    let toDay = (0, moment_1.default)().format("YYYY-MM-DD");
    let req = {
        simple_date: toDay,
        operation: "SIMPLE",
        schedule_estado: [1]
    };
    listEventToNotify = [];
    (0, call_function_schedule_1.functLoadScheduler)(req).then((response) => {
        response.rows.forEach(({ data }) => {
            if (typeEvent !== data.schedule_type) {
                let originalDate = data.schedule_startdate;
                data.schedule_startdate_origin = (0, moment_1.default)(originalDate, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm");
                data.schedule_startdate = (0, moment_1.default)(originalDate, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm");
                listEventToNotify.push(Object.assign({}, data));
                data.schedule_dayadvance.forEach((time) => {
                    let _date = (0, moment_1.default)(originalDate, "YYYY-MM-DD HH:mm").toDate();
                    _date.setMinutes(_date.getMinutes() - time);
                    data.schedule_startdate = (0, moment_1.default)(_date, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm");
                    listEventToNotify.push(Object.assign({}, data));
                });
            }
        });
    });
};
if (args_1.args.appMode !== "public") {
    node_cron_1.default.schedule('0 0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        funLoadSchedules();
    }));
}
setInterval(() => {
    if (noLoadAlerts && !listEventToNotify.length || forceReloadAlerts)
        funLoadSchedules();
    listEventToNotify.forEach((_a) => {
        var { schedule_startdate } = _a, data = __rest(_a, ["schedule_startdate"]);
        if (schedule_startdate === (0, moment_1.default)().format("YYYY-MM-DD HH:mm")) {
            setTimeout(() => {
                calendar_1.Schedule.notify(Object.assign(Object.assign({}, data), { schedule_startdate })).then(() => {
                });
            }, 1000);
        }
    });
}, 60000);
//# sourceMappingURL=calendar.route.js.map