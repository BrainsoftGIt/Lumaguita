import {factory} from "./server/service/database.service";
import {catchAll, catchLast, Templates} from "zoo.pg";
import {catchFirst} from "zoo.pg/lib/result";
import fs from "fs";


let promise = factory.create(Templates.PARAMETERIZED).sql`select * from tweeks.unit`;

let response = {};
catchFirst( promise ).then(  value => {
    response["catchFirst"] = value;
});

catchAll( promise ).then(  value => {
    response["catchAll"] = value;
});

catchLast( promise ).then(  value => {
    response["catchLast"] = value;
    fs.writeFileSync( "catch.json", JSON.stringify( response ) )
});


