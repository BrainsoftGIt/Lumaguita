import { app } from '../../../service/web.service';
import {clusterServer} from "../../../service/cluster.service";
import * as path from "path";

app.post("/api/branch", async (req, res) =>{
    const {functSetBranch} = require("../db/call-function-branch");
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.branch_user.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.branch_workspace.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    req.body.branch_user.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.branch_workspace.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_espaco_id = req?.session?.auth_data?.auth?.armazem_atual || null;
    const response = await functSetBranch(req.body);
    clusterServer.notifyLocalChange( {
        event: "NEW-BRANCH-SETS",
        message: "OLA MUNDO",
        extras: { branch: "LAlALALA" }
    })
    res.json({result: response.row.main.result, data: response.row.main.message});
});
app.get("/api/branch", async (req, res) =>{
    const {functLoadBranch} = require("../db/call-function-branch");
    const response = await functLoadBranch(null);
    res.json({branchs: response.rows});
});
app.get("/api/path/clusters", async (req, res) =>{
    const {functLoadPaths} = require("../db/call-function-branch");
    const response = await functLoadPaths(null);
    res.json({paths: response.rows});
});
app.get("/api/all/menus", async (req, res) =>{
    const {functLoadAllMenus} = require("../db/call-function-branch");
    const response = await functLoadAllMenus(null);
    res.json({menus: response.rows});
});

app.post("/api/send/crashdump",  async (req, res) =>{
    const {crashDump} = require("../../../service/log.service/crashdump")
    crashDump().then( async value => {
        console.log( value );
        const {mailSender} = require( "../../../service/mail/index");
        const {K} = require("../../../service/mail/K");
        let remetente = "";
        let filename = value.zipFile.split("/");
        const mails = await mailSender.sendMail({
            from: `"${remetente}" <${K.MAIL.email}>`,
            to: `"${K.MAIL.name}" <${K.MAIL.email_receiver}>`,
            subject: "Luma - crush dump",
            html: `Segue em anexo, o ficheiro com os erros no software Luma.`,
            attachments:[
                {
                    filename: filename[filename.length-1],
                    path: path.join(__dirname, value.zipFile)
                }
            ]
        });
    });
});
