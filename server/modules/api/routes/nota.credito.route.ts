import {app, storage} from '../../../service/storage.service';
import {getUserSession} from "./functions/get-session";
import {dbRes} from "../../../service/database.service/kitres/res";
import {Result} from "kitres";

app.post( "/api/load/fatura/to/credito/nota", (req, res, next) => {
    console.log( { etag: req.headers.etag } );
    let _session = getUserSession( req );

    let args = req.body;
    args.arg_colaborador_id = _session.user_id;
    args.arg_espaco_auth = _session.workspace;

    dbRes.call.tweeks.funct_load_conta_notacredito({ args }, {
        onResult(error: Error, result?: Result<any, any>): any {
            if( error ){
                res.json({
                    result:false,
                    message: 'Error ao salar  o relatorio parametizados',
                    hint: error.message
                })
                console.error( error );
                return;
            }

            return res.json({
                fatura: result.rows?.[0] || [],
            })
        }
    })
});

app.post( "/api/reg/credito/nota", (req, res, next) => {
    console.log( { etag: req.headers.etag } );
    let _session = getUserSession( req );

    let args = req.body;
    args.arg_colaborador_id = _session.user_id;
    args.arg_espaco_auth = _session.workspace;

    dbRes.call.tweeks.funct_reg_conta_nota_credito({ args }, {
        onResult(error: Error, result?: Result<any, any>): any {
            console.log({result})
            if( error ){
                res.json({
                    result:false,
                    message: 'Error ao salar  o relatorio parametizados',
                    hint: error.message
                })
                console.error( error );
                return;
            }

            return res.json({
                result:result.rows[0]["result"],
                message:result.rows[0]["message"],
                data:result.rows.filter( (value, index) => index > 0 )
            })
        }
    })
});