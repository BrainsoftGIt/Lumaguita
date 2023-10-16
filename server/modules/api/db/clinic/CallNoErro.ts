// import {Catch, CatchAll} from "zoo.pg/lib/result";

import { CatchAll, Catch } from "kitres";

export const resolveClinicAllIfNoDatabase = () => {
    return new Promise<CatchAll<any,any>>(
        (resolve) => {
            resolve({
                status: false,
                message: null,
                rows: [],
                notices: null,
                dataInfo: null,
                error: null,
                // result: {
                //     result: false,
                //     message: "",
                //     err: "",
                //     data: ""
                // },
                // lastNotice: null
            });
        }
    )
}


export const resolveClinicLastIfNoDatabase = () => {
    return new Promise<Catch<any,any>>(
        (resolve) => {
            resolve({
                status: false,
                message: null,
                // dataInfo: null,
                error: null,
                // result: {
                //     result: false,
                //     message: "",
                //     err: "",
                //     data: ""
                // },
                lastNotice: null,
                row: {},
            });
        }
    )
}