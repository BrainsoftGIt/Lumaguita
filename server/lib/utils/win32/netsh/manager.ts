
require("source-map-support").install();

import child_process, {spawn} from "child_process";
import iconv from "iconv-lite";
import {TempScript} from "../../tempscript";
import {win32TempScriptEngine} from "../../tempscript/engines/win32.engine";

const NETSH_FIREWALL = 'NETSH ADVFIREWALL FIREWALL';
const CREATE = 'ADD RULE';
const READ = 'SHOW RULE';
const UPDATE = 'SET RULE';
const DELETE = 'DELETE RULE';

export type NetRuleQuery = {
    name:string
    dir?:"in" | "out"
}
export type NetRuleValues = {
    action: "allow" | "block" | "bypass",

    /**
     * <program path>
     */
    program?: string,

    /**
     * <service short name> | any
     */
    service?: string,

    /**
     * yes | no (default = yes)
     */
    enable?: "yes"|"no",

    /**
     * any | <IPv4 address> | <IPv6 address> | <subnet> | <range> | <list> ]
     */
    localip?: string,

    /**
     * any | localsubnet | dns | dhcp | wins | defaultgateway | <IPv4 address> | <IPv6 address> | <subnet> | <range> | <list> ]
     */
    remoteip?: string,

    /**
     * 0-65535 | <port range>[ ,... ] | RPC | RPC-EPMap | IPHTTPS | any (default = any) ]
     */
    localport?: number|string|(number|string)[],

    /**
     * 0-65535 | <port range>[ ,... ] | RPC | RPC-EPMap | IPHTTPS | any (default = any) ]
     */
    remoteport?: number|string|(number|string)[],

    /**
     * 0-255 | icmpv4 | icmpv6 | icmpv4:type,code | icmpv6:type,code | tcp | udp | any (default = any)
     */
    protocol?: number|string|"icmpv4" | "icmpv6" | "icmpv4:$type,$code" | "icmpv6:$type,$code" | "tcp" | "udp" | "any",

    interfacetype?: "wireless" | "lan" | "ras" | "any",

    /**
     *  <SDDL string>
     */
    rmtcomputergrp?:string,

    /**
     *   <SDDL string>
     */
    rmtusrgrp?:string,

    /**
     *   (default = no)
     */
    edge?:"yes" | "deferapp" | "deferuser" | "no",

    /**
     * (default = notrequired)
     */
    security?: "authenticate" | "authenc" | "authdynenc" | "authnoencap" | "notrequired"

    profile?: "public" | "private" | "domain" | ("public" | "private" | "domain") [],


    description?: string,

}

export type NetRuleEntry = {
    name?:string
    dir?:"in" | "out"
} & NetRuleValues;

export type NetRuleResult = {
    'Rule Name': string,
    Enabled: "Yes"|"No",
    Direction: "In" |"Out",
    Profiles: "Public" | "Private" | "Domain" | string,
    Grouping: string,
    LocalIP: string,
    RemoteIP: string,
    Protocol: string,
    LocalPort: string,
    [p:string]:string
}

const netshEngine = {
    parse( rule, stdout:string ){
        let lines = stdout.split( "\n" );
        let bloks = [];
        let nextLot:string = "";
        lines.forEach( line => {
            if( !line.trim().length || line.trim() === "Ok."){
                if(nextLot.length ) bloks.push( nextLot );
                nextLot = "";
                return;
            }
            nextLot+="\n";
            nextLot+=line;
        });

        let results:any[] = [];
        bloks.forEach( block => {
            // block = block;
            let _rule = {};
            if (rule != READ)
                return undefined;
            let rows = block.split('\n');
            rows.forEach(function (item, index) {
                if (index == 0 || index == 2 || index > rows.length - 4)
                    return;
                let row = item.split(':');
                _rule[row[0]] = row[1].replace('\r', '').trim();
            });
            results.push( _rule );
        });
        if( results.length === 1 ) return results[0];
        else return results;
    }, stringify( object ):string{
        return JSON.stringify(object).replace('{', '').replace('}', '').replace(/,/gi, ' ').replace(/:/gi, '=');
    }, command( rule, opts, update? ) {
        return NETSH_FIREWALL + " " + rule + " " + this.stringify(opts) + " " + (update ? "new " + this.stringify(update) : '');
    }, queryOf( entry:NetRuleQuery|NetRuleEntry ) {
        let keys = Object.keys( entry );
        let query = {} as NetRuleQuery;
        if( keys.includes( "name" ) ) query[ "name" ] = entry.name;
        if( keys.includes( "dir" ) ) query[ "dir" ] = entry.dir;
        return query;

    }, execute( rule, opts:NetRuleEntry|NetRuleQuery, update?:NetRuleEntry):Promise<NetRuleResult|NetRuleResult[]> {
        const self = this;

        let query = self.queryOf(update||opts );


        return new Promise(async function (resolve, reject) {
            if( [ READ ].includes( rule ) ) {

                let command = self.command( rule, query );
                child_process.exec(command, { encoding: 'buffer' }, function (err, stdout, stderr) {
                    if (err)
                        reject(err);
                    else {
                        var out = iconv.decode(stdout, 'euc-kr');
                        resolve(self.parse( rule, out ));
                    }
                });
            } else {
                let command = self.command( rule, opts, update );
                console.log( command );

                const script = new TempScript(win32TempScriptEngine)
                    .command( command )
                    .script;
                const elevate = "elevate.exe";
                let process = spawn( elevate, [ script.filename ] );
                process.on( "exit", code => {
                    setTimeout( ()=>{
                        self.execute( READ, query ).then( resolve ).catch( reject );
                    }, 1000 )
                });
            }
        });
    }
}


export const netshRuleManage  = {
    get( rule:NetRuleQuery ){
        return new Promise((resolve ) => {
            netshEngine.execute( READ, rule ).then( resolve )
                .catch( reason => { resolve( null )});
        });

    }, add( rule:NetRuleQuery&NetRuleValues ){
        return netshEngine.execute( CREATE, rule );

    }, delete( rule:NetRuleEntry ){
        return netshEngine.execute( DELETE, rule );

    }, update( query:NetRuleQuery, update:NetRuleEntry ){
        return netshEngine.execute( UPDATE, query, update );

    }, sets( rule:NetRuleQuery&NetRuleValues ){
        let self = this;
        return self.get( rule ).then( value => {
            if( Array.isArray( value ) ) return Promise.resolve( null );
            else if ( value  && typeof value === "object" ) return self.update( netshEngine.queryOf( rule ), rule );
            else return self.add( rule );
        }).catch( reason => {
            console.error( reason );
            return self.add( rule );
        });
    }

}