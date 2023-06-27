export const listen ={
    value:Math.trunc( Math.random()* 888888 ),
    handlers:[],
    notify(...data){
        listen.handlers.forEach( value =>  value(...data))
    }
}
