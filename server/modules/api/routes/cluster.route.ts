import {app} from '../../../service/web.service';
import {clusterServer} from "../../../service/cluster.service";
import path from "path";
import fs from "fs";
import {ClusterEvent} from "../../../lib/cluster/enuns";
import {Folders} from "../../../global/project";
import {factory} from "../../../service/database.service";
import {Templates, Types} from "zoo.pg";

app.post("/api/clusters/load", async (req, res) =>{
    const {functLoadClusters} = require("../db/call-function-cluster");
    const response = await functLoadClusters(null);
    res.json({clusters: response.rows});
});

app.post("/api/cluster", async (req, res) =>{
    const {functRegCluster} = require("../db/call-function-cluster");
    const response = await functRegCluster(req.body);
    res.json({result: response.row.main.result, data: response.row.main.message});
    if(response.row.main.result){
        if(parseInt(req.body.cluster_type) === 4){
            let object = {cluster_name: response.row.main.data.child.cluster_name, cluster_identifier: response.row.main.data.child.cluster_identifier,
                cluster_path: response.row.main.data.child.cluster_path};
            clusterServer.notifyRemoteChange( object, {
                event: "CLUSTER:REG",
                extras: null,
                message: "Registo de cluster"
            });
        }
        else if (parseInt(req.body.cluster_type) === 2){
            clusterServer.notifyChangeConfigs( );
        }
    }
});
app.post("/api/cluster/change/license", async (req, res) =>{
    const {functChangeClusterLicense} = require("../db/call-function-cluster");
    const response = await functChangeClusterLicense(req.body);
    res.json({result: response.row.main.result, data: response.row.main.message});
});
app.post("/api/cluster/reload", async (req, res) =>{
    const {functUnlinkAndLiknk} = require("../db/call-function-cluster");
    const response = await functUnlinkAndLiknk(req.body);
    res.json({result: response.row.main.result, data: response.row.main.message});
});
app.get("/api/cluster/validation/period", async (req, res) =>{
    const { sql } = factory.create( Templates.PARAMETERIZED );
    let _data = [];
    sql`
        select * from cluster.tperiod order by tperiod_id;
       `.stream((data) => {
        _data.push(data);
    }).catch(err => {
    }).finally(async function () {
        res.json({periods: _data});
    });
});

app.get("/api/cluster/license/:cluster_uuid", async (req, res) =>{
    const {functLoadClusters} = require("../db/call-function-cluster");
    const response = await functLoadClusters(null);
    const {generateEncryptionKey} = require("../../../lib/crypto/cryptoFile");
    let encryptor = require('simple-encryptor')(generateEncryptionKey());

    fs.mkdirSync(path.join(Folders.temp, 'multer'), {recursive: true});
    let clusterRemoto = response.rows.find(value => value.data.cluster_uid === req.params.cluster_uuid);
    if(clusterRemoto){
        let licenseIdentifier = "Luma_"+clusterRemoto.data.cluster_name+"_"+clusterRemoto.data.cluster_identifier+".lic";
        let dados_registo = {
            cluster_identifier: clusterRemoto.data.cluster_identifier,
            cluster_code: clusterRemoto.data.cluster_code,
            cluster_api: clusterRemoto.data.cluster_api,
            cluster_domain: req.protocol+"://"+req.hostname,
            cluster_port: 80,
            cluster_type: 2,
            cluster_license: clusterRemoto.data.cluster_license,
            cluster_licenselife: clusterRemoto.data.cluster_licenselife,
            cluster_tperiod_id: clusterRemoto.data.tperiod_id
        }
        fs.writeFile(path.join(Folders.temp, 'multer/'+licenseIdentifier), encryptor.encrypt(dados_registo), (err) => {
            if(err) return console.log(err);
            else res.download(path.join(Folders.temp, 'multer')+"/"+licenseIdentifier, licenseIdentifier);
        });
    }
});

 app.post("/set/load/license", async (req, res) =>{
     const {generateEncryptionKey} = require("../../../lib/crypto/cryptoFile");
     const {functRegCluster} = require("../db/call-function-cluster");
     let encryptor = require('simple-encryptor')(generateEncryptionKey());

     if(req.file){
         const readable = fs.createReadStream(req.file.path);
         let cluster_data= "";
         readable.on('readable', (chunk) => {
             let buf = readable.read()
             if (buf != null) {
                 cluster_data += buf.toString();
             }
         }).on('close', async function () {
             fs.unlinkSync(req.file.path);
             cluster_data = encryptor.decrypt(cluster_data);
             if(!hasLicenseKeyData(cluster_data)) {
                 console.log( "[maguita]", `Ficheiro de licença inválido! not hasLicenseKeyData`)
                 res.json({result: false, data: "Ficheiro de licença inválido!"});
             }
             else{
                 const response = await functRegCluster({
                     cluster_grants: [], cluster_identifier: cluster_data["cluster_identifier"],
                     cluster_type: cluster_data["cluster_type"],
                     cluster_api: cluster_data["cluster_api"],
                     cluster_port: cluster_data["cluster_port"],
                     cluster_domain: cluster_data["cluster_domain"],
                     cluster_license: cluster_data["cluster_license"],
                     cluster_licenselife: cluster_data["cluster_licenselife"],
                     cluster_tperiod_id: cluster_data["cluster_tperiod_id"],
                     cluster_code: cluster_data["cluster_code"]
                 });
                 if(response.row.main.result){
                     clusterServer.notifyChangeConfigs( );
                     clusterServer.onceClusterEventListener(ClusterEvent.CONFIGS, EVENT => {
                         res.json({result: response.row.main.result, data: response.row.main.message});
                     });
                 }
                 else res.json({result: response.row.main.result, data: response.row.main.message});
             }
         }).on('end', function () {
               readable.destroy();
         })
     } else{
         console.log( "[maguita]", `Ficheiro de licença inválido! not has req.file` )
         res.json({result: false, data: "Ficheiro de licença inválido!"});
     }
 });

function hasLicenseKeyData(cluster) {
    return cluster?.cluster_identifier &&
        cluster?.cluster_type &&
        cluster?.cluster_api &&
        cluster?.cluster_port &&
        cluster?.cluster_license &&
        cluster?.cluster_licenselife &&
        cluster?.cluster_code &&
        cluster?.cluster_tperiod_id;
}
