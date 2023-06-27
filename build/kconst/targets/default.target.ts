import { kconst, targets } from "../index";
import * as path from "path";

kconst.target(target => {
    //language=file-reference
    targets.KNode = target.nodeJs( { className: "K", typescript: true, dir: path.join( __dirname, "../../../server/global/autogen" ), })

    //language=file-reference
    // @ts-ignore
    targets.dbConnection = target.nodeJs( { className: "db", dir:  path.join( __dirname, "../../../server/global/autogen/config" ) })

    //language=file-reference
    // @ts-ignore
    targets.srvConfig = target.nodeJs( { className: "srv", dir:  path.join( __dirname, "../../../server/global/autogen/config" ) })

    //language=file-reference
    // @ts-ignore
    targets.srvDBK = target.nodeJs( { className: "DBK", dir:  path.join( __dirname, "../../../server/global/autogen" ) })//language=file-reference

    //language=file-reference
    targets.webDBK = target.js( { className: "DBK", dir:  path.join( __dirname, "../../../client/public/assets/js/admin" ) })

    //language=file-reference
    targets.java = target.java( { className: "JavaClass", dir: path.join( __dirname, "../../../server/global/autogen/java" ), packageName: "com.brainsoft.piripiri" } )

    //language=file-reference
    targets.web = target.js( { className: "Config", dir:  path.join( __dirname, "../../../client/public/assets/js/socket" ) })

});







