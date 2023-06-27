
export function escapeSpaceQuotes(string, force?:boolean){
    string = `${string}`;
    string = string.trim();
    string = string.replace( /"/g, '""' );
    if( string.match( / /g)
        || string.match( /"/g)
        || string.match(/'/g)
        || string.match(/,/g)
        || string.match(/;/g)
    ) string = `"${string}"`;
    if( force && string.charAt(0) !== '"' ) string = `"${string}"`;

    return string;
}