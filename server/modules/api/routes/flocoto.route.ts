import {app} from "../../../service/web.service";
import {flocoto} from "kitres";
import e from "express";

flocoto.integration( app, {
    connection(opts: flocoto.ConnectOptions, req: e.Request): flocoto.ConnectResponse | Promise<flocoto.ConnectResponse> {
        return {

        }
    }, auth(opts: flocoto.ConnectAuthOptions, newAuthSession: flocoto.AuthSession, req: e.Request): flocoto.ConnectAuthResponse | Promise<flocoto.ConnectAuthResponse> {
        if( !req.session["lumaguitaSession"])  req.session["lumaguitaSession"] = {};
        let _lumaguita = req.session["lumaguitaSession"];
        _lumaguita.icount ++;
        req.session.save();

        return {
            extrasAll: {
                message: "Varios artigos cadastrados na base de dados!",
                counter: _lumaguita.icount
            }, extrasSession: {
                "lumaguita:pos":{
                    "ARMAZEM_ATIVO": "sdsds"
                }
            }
        }
    }
})


app.get( "/api/test", (req, res, next) => {
    res.json( req.session );
    console.log( {
        LumaguitaFlocotoShare: req.session.flocotoShare,
        LumaguitaFlocotoAuth: req.session.flocotoAuth,
    })
})