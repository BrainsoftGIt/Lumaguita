import {app, storage} from '../../../service/storage.service';
import {functRegPosto} from "../db/call-function-posto";
import fs from "fs";
import path from "path";

app.get("/api/system/type", async (req, res) =>{
    const fs = require("fs");
    //language=file-reference
    let system = JSON.parse(fs.readFileSync(path.join(__dirname, "../../../lib/json/typeSystem.json")));
    res.json({system: system});
});

app.post("/api/array/set", async (req, res) =>{
    const fs = require("fs");
    //language=file-reference
    let listData = JSON.parse(fs.readFileSync(path.join(__dirname, "../../../lib/json/_db.json")));
    let listResult = {map: [], rows:[]};

    listData.forEach((object, index) =>{
        let keyValue = Object.keys(object);
        if(index === 0){
            listResult.map = keyValue;
        }
    });
});