import { object_util } from "kitres";

let ss = {
    name:"Maria",
    itens: [ 1, 2, 3, 4 ],
    client:(new (class Client{
        saldo= 23
        credito =23.3
        message = "Conta do cliente Maria"
    }))
};

console.log( object_util.describe(ss))