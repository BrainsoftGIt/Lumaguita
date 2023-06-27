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
exports.Schedule = void 0;
const mail_1 = require("../../../../../service/mail");
const call_function_schedule_1 = require("../../../db/clinic/call-function-schedule");
const moment_1 = __importDefault(require("moment"));
let Types = {
    "055f35b5-e5f1-4c66-92f8-3b2fe2362457": "Consulta de Seguimento",
    "a7228a44-ea34-42cb-9978-3d5a3f968424": "Vacinação",
    "c16c935a-396a-4191-af39-a731185703d7": "Consulta Geral",
    "cd5c3c8b-a568-4104-9910-83b8787cc831": "Desparasitação",
    "920eb08f-5f59-47bb-9d48-32da83bf83eb": "Evento",
    "7e7628b3-7c92-4765-8bf4-f253b7526ad6": "Cirurgia"
};
exports.Schedule = {
    notify: (data) => __awaiter(void 0, void 0, void 0, function* () {
        for (const patient_uid of data.schedule_patients) {
            let patient = __rest((yield (0, call_function_schedule_1.getPatient)({ patient_uid })).row.data, []);
            if (!patient.patient_responsible.email) {
                continue;
            }
            let day = (0, moment_1.default)(data.schedule_startdate_origin, "YYYY-MM-DD HH:mm").locale('pt').format("dddd [dia] DD [de] MMMM [de] YYYY HH:mm");
            const mails = yield mail_1.mailSender.sendMail({
                from: `"Zuntapata - Serviços Veterinarios" <${"zuntapata@brainsoftstp.com"}>`,
                // @ts-ignore
                to: `"${patient.patient_responsible.nome}" <${patient.patient_responsible.email}>`,
                subject: `Zuntapata - Notificação (${Types[data.schedule_type]})`,
                // @ts-ignore
                html: `Olá (${patient.patient_responsible.nome.split(" ")[0]})
                <br>
                ${patient.patient_name} tem uma ${Types[data.schedule_type]} marcada para ${day}.
                Para alteração da data ou horário, por favor contacte-nos através do +239 9960987.
                `,
            });
        }
    })
};
//# sourceMappingURL=calendar.js.map