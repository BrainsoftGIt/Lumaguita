import {Catch, CatchAll} from "zoo.pg/lib/result";

export const resolveClinicAllIfNoDatabase = () => {
    return new Promise<CatchAll>(
        (resolve, reject) => {
            resolve({
                status: false,
                message: null,
                rows: [],
                notices: null,
                dataInfo: null,
                error: null,
                result: {
                    result: false,
                    message: "",
                    err: "",
                    data: ""
                },
                lastNotice: null
            });
        }
    )
}


export const resolveClinicLastIfNoDatabase = () => {
    return new Promise<Catch>(
        (resolve, reject) => {
            resolve({
                status: false,
                message: null,
                dataInfo: null,
                error: null,
                result: {
                    result: false,
                    message: "",
                    err: "",
                    data: ""
                },
                lastNotice: null,
                row: {},
            });
        }
    )
}