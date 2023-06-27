export function includeAll( array:any[], ...checks:any[]):boolean{
    return !checks.find( value => !array.includes( value));
}

export function includeAny( array:any[], ...checks:any[]):boolean{
    return !!checks.find( value => array.includes( value));
}

export function excludeAll( array:any[], ...checks:any[]):boolean{
    return !checks.find( value => array.includes( value));
}

export function excludeAny( array:any[], ...checks:any[]):boolean{
    return !!checks.find( value => !array.includes( value));
}



