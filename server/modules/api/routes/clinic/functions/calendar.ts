import {mailSender} from "../../../../../service/mail";
import {getPatient} from "../../../db/clinic/call-function-schedule";
import moment from "moment";

let Types= {
    "055f35b5-e5f1-4c66-92f8-3b2fe2362457": "Consulta de Seguimento",
    "a7228a44-ea34-42cb-9978-3d5a3f968424": "Vacinação",
    "c16c935a-396a-4191-af39-a731185703d7": "Consulta Geral",
    "cd5c3c8b-a568-4104-9910-83b8787cc831": "Desparasitação",
    "920eb08f-5f59-47bb-9d48-32da83bf83eb": "Evento",
    "7e7628b3-7c92-4765-8bf4-f253b7526ad6": "Cirurgia"
}

export let Schedule= {
    notify : async (data) => {
        for (const patient_uid of data.schedule_patients) {
            let {row : { data: {...patient}}} = await getPatient({patient_uid});
            if(!patient.patient_responsible.email){
                continue
            }
            let day = moment(data.schedule_startdate_origin, "YYYY-MM-DD HH:mm").locale('pt').format("dddd [dia] DD [de] MMMM [de] YYYY HH:mm")
            const mails = await mailSender.sendMail({
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
    }
}