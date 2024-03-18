import {app} from "../index";
import cluster from "cluster";

import manifest from "../../../../package.json";
const TAG = `[${manifest.name}]`

namespace welcome {
    export const ExcludePath = [
        /\/__flocoto\/internal\/connect$/
    ]
}
app.use( (req, res, next) => {
    if( !!welcome.ExcludePath.find( value => value.test( req.path ) ) ) return next();

    if( cluster.isWorker ) console.log( TAG, `new request from ${req.headers.host} ON worker-id: ${cluster.worker.id} | ${req.method}${req.path}`);
    else console.log( TAG, `new request from ${req.headers.host} | ${req.method}${req.path}`);
    next();
});


export = welcome;