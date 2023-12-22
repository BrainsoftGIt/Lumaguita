import {app, storage} from '../../../service/storage.service';
import {getUserSession, getUserSessionPOS} from "./functions/get-session";
import {dbRes} from "../../../service/database.service/kitres/res";
import {Result} from "kitres";
import {functLoadContaData} from "../db/call-function-pos";
import {functLoadDepositoData} from "../db/call-function-contacorrrente";
import {functLoadDadosEmpresa} from "../db/call-function-settings";
app.post( "/api/load/doc/to/nota", (req, res, next) => {
    let _session = getUserSession( req );

    let args = req.body;
    args.arg_colaborador_id = _session.user_id;
    args.arg_espaco_auth = _session.workspace;
    console.log( "console.log( args )", args )
    dbRes.call.tweeks.funct_load_conta_docs_financa({ args }, (error, result) => {
        if( error ){
            res.json({
                result:false,
                message: error.message,
                hint: error
            })
            console.error( error );
            return;
        }

        return res.json({
            fatura: result.rows?.[0] || {},
        })
    })
});

app.post( "/api/reg/credito/nota", (req, res, next) => {
    let _session = getUserSession( req );

    let args = req.body;
    args.arg_colaborador_id = _session.user_id;
    args.arg_espaco_auth = _session.workspace;


    console.log( args )

    dbRes.call.tweeks.funct_reg_conta_docs_financa({ args }, {
        onResult(error: Error, result?: Result<any, any>): any {
            if( error ){
                res.json({
                    result:false,
                    message: error.message,
                    hint: error
                })
                console.error( error );
                return;
            }

            console.log( result.rows )
            return res.json({
                result: !!result?.rows?.[0]?.["result"],
                message: result?.rows?.[0]?.["message"] || "",
                data:result?.rows?.[0]?.data || {}
            })
        }
    }).doc()
});

app.post( "/api/load/documents", (req, res, next) => {
    let _session = getUserSession( req );

    let args = req.body;
    args.arg_colaborador_id = _session.user_id;
    args.arg_espaco_auth = _session.workspace;

    dbRes.call.tweeks.funct_load_conta_documento_limit({ args }, {
        onResult(error: Error, result?: Result<any, any>): any {
            if( error ){
                res.json({
                    result:false,
                    message: error.message,
                    hint: error
                })
                console.error( error );
                return;
            }
            return res.json(result?.rows)
        }
    }).doc()
});

app.post( "/api/get/number/document", (req, res, next) => {
    let dados = req.body;
    let _session = (!!dados.admin) ? getUserSession( req ) : getUserSessionPOS( req );

    if(dados.conta_id) {
        functLoadContaData({
            arg_conta_id: dados.conta_id,
            with_client: true,
            arg_espaco_auth: _session.workspace,
            arg_colaborador_id: _session.user_id
        }).then(({rows}) => {
            let {0: {main: {conta_serie}}} = rows;
            let {document} = conta_serie || {};
            res.json({
                document
            })
        });
    }

    if(dados.deposito) {
        functLoadDepositoData({deposito_id: dados.deposito}).then(({rows}) => {
            let {data} = rows?.[0] || {};
            let  {deposito_documento: document} = data || {};
            res.json({
                document
            })
        })
    }
});


app.get( "/api/has/permition/show/artigo/dethais", (req, res, next) => {
    const {functLoadDadosEmpresa} = require("../db/call-function-settings");
    req.body.arg_espaco_auth = req?.session?.auth_data?.auth?.armazem_atual || null;
    req.body.arg_colaborador_id = req?.session?.auth_data?.auth?.colaborador_id || null;
    functLoadDadosEmpresa(req.body).then(({rows}) => {
        let {0: {funct_load_espaco_configuracao: {espaco: {espaco_configuracao: {mostrarDetalhesArtigoNatatura}}}}} = rows || {0: {}};
        res.json({
            mostrarDetalhesArtigoNatatura
        })
    });
});
