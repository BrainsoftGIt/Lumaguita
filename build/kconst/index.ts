import * as Path from "path";

require( 'source-map-support' ).install();

import {Arguments} from "zoo.util/lib/arguments";
import * as os from "os";
import { KConst, SelectorItem } from "kconst";
import path from "path";


const args = new Arguments<{ user:string, mode:string }>( true );
args.argument = { name: "user", alias: "u", value: os.userInfo().username, type: String };
args.argument = { name: "mode", alias: "m" };
const { user, mode } = args.values;

export const targets:any = {};

export const kconst = new KConst({
    root: __dirname,
    user: user,
    mode: mode,
    name: "K",
    targets: "targets",
    triggers: "triggers",
    exports: "exports",
    events: "events",
    priorityOrder: [ SelectorItem.DEFAULT, SelectorItem.USER, SelectorItem.MODE, SelectorItem.MODE_USER ]
});

export const K = kconst.K;

kconst.collectCallbacks();
const _targets = targets;
const _kconst = kconst;

let _use_targets:any = { };

kconst.target(target => {
    //language=file-reference
    _use_targets.info = target.nodeJs( { className: "INFO", typescript: true, dir: path.join( __dirname, "autogen" ), })
});

kconst.declares( (exports, override, SELF_NAME, props) => {
    props.override( ()=>{
        _kconst.K["_KCONST_BUILD_USER_USING775533"] = user; exports( _use_targets.info );
        _kconst.K["_KCONST_BUILD_MODE_USING775533"] = mode; exports( _use_targets.info );
    })
});

kconst.startDeclarations();
kconst.publish();
console.log( "user:", user )
console.log( "mode:", mode )