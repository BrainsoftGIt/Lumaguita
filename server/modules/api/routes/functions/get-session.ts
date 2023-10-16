import {Request} from "express";

export function getUserSession( req: Request<{}, any, any, any, Record<string, any>>){
    return {
        user_id: req?.session?.auth_data?.auth?.colaborador_id,
        branch_uid: req?.session?.auth_data?.auth?.branch_uuid,
        workspace: req.session?.auth_data?.auth?.armazem_atual
    }
}

export function getUserSessionPOS( req: Request<{}, any, any, any, Record<string, any>>){
    return {
        user_id: req?.session?.user_pos?.auth?.colaborador_id,
        branch_uid: req?.session?.user_pos?.espaco_trabalha?.[0]?._branch_uid,
        workspace: req.session?.user_pos?.auth?.armazem_atual
    }
}
