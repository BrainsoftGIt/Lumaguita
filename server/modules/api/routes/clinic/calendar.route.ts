import {app, storage} from '../../../../service/storage.service';
import cron from "node-cron";
import moment from "moment";
import {Schedule} from "./functions/calendar";
import {args} from "../../../../global/args";
import {functLoadScheduler} from "../../db/clinic/call-function-schedule";
import {CatchAll} from "kitres";
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
}

app.get("/api/clinica/calendar", async (req, res) =>{

        const {functLoadScheduler} = require("../../db/clinic/call-function-schedule");
        req.body.schedule_estado = [1];

        let {start, end} = req.query;
        req.body.operation = "RANGE";
        req.body.range_start = start.toString().substring(0, 10)
        req.body.range_end = end.toString().substring(0, 10)



        let response:CatchAll<any,any> = await functLoadScheduler(req.body);
        if( !response.status ) return res.json([])

        res.json((response?.rows || []).map(({data}) => {
                data.id = data.schedule_schedule_uuid || data.schedule_uuid;
                data.title = data.schedule_name;
                data.start  = data.schedule_startdate;
                data.end = data.schedule_enddate;
                data.color = consultaColor?.[data.schedule_type] || "Black";
                return data//{id : data.id, title : data.title, start: data.start, end : data.end}
            })
        );

});


app.post("/api/clinica/calendar/set", async (req, res) =>{
    try{
        const {functSetScheduler} = require("../../db/clinic/call-function-schedule");
        req.body.schedule_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
        req.body.schedule_colaborador_uid = req?.session?.auth_data?.auth?.colaborador_id || null;
        req.body._branch_uid = req?.session?.auth_data?.auth?.branch_uuid || null;

        forceReloadAlerts = true
        let response = await functSetScheduler(req.body);
        res.json({response});
    }catch (e) { console.error( e )}
});

let funLoadSchedules = () => {

    noLoadAlerts = false
    forceReloadAlerts = false

    let toDay = moment().format("YYYY-MM-DD");

    let req = {
        simple_date: toDay,
        operation: "SIMPLE",
        schedule_estado: [1]
    };

    listEventToNotify = [];
    functLoadScheduler(req).then((response) => {
        (response?.rows || []).forEach(({data}) => {
            if(typeEvent !== data.schedule_type){
                let originalDate = data.schedule_startdate;
                data.schedule_startdate_origin = moment(originalDate, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm")
                data.schedule_startdate = moment(originalDate, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm")
                listEventToNotify.push({...data});
                data.schedule_dayadvance.forEach((time) => {
                    let _date = moment(originalDate, "YYYY-MM-DD HH:mm").toDate();
                    _date.setMinutes(_date.getMinutes() - time)
                    data.schedule_startdate = moment(_date, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm")
                    listEventToNotify.push({...data});
                })
            }
        })
    });
}

if ( args.appMode !== "public" ){
    cron.schedule('0 0 0 * * *', async () => {
        funLoadSchedules()
    });

    setInterval(() => {
        if(noLoadAlerts && !listEventToNotify.length || forceReloadAlerts)
            funLoadSchedules()
        listEventToNotify.forEach(({schedule_startdate, ...data}) => {
            if(schedule_startdate === moment().format("YYYY-MM-DD HH:mm")) {
                setTimeout(() => {
                    Schedule.notify({...data, schedule_startdate}).then(() => {

                    })
                }, 1000)
            }
        })
    }, 60000)
}
