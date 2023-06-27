export type GenericTray<T, I> = {
    systray?:T,
    items?:I[],
    ready?:boolean
    maps?:GenericMenuMaps,
    close():Promise<any>;
}

export type GenericMenuMaps = {[p:string|number]:GenericMenuItem<GenericMenuMaps>}|(GenericMenuItem<GenericMenuMaps>)[]
export type GenericMenuItem<C> = {
    identifier?:string,
    type?:"separator"|"normal"|"checkbox"
    title: string;
    tooltip: string;
    checked?: boolean;
    enabled?: boolean;
    hidden?: boolean;
    icon?: string;
    isTemplateIcon?: boolean;
    key?: string,
    combination?: "ctrl+alt+a"|string,
    click?( tray:GenericTray<any, any>, GenericMenuItem ):any,
    itemList?: C,
    paths?:string[]
}

export const GENERIC_SEPARATOR:GenericMenuItem<any> = { title: "<SEPARATOR>", tooltip: "", type: "separator" } as const;

export type GenericMenuList = (GenericMenuItem<GenericMenuList>)[]
export type MenuItemTransform<T> = ( menu:GenericMenuItem<GenericMenuList> )=> T;

export function menuRender<T, I>(tray:GenericTray<T, I>, transform:MenuItemTransform<I>, maps?:GenericMenuMaps ):I[]{
    let list :I[]= [];
    if( !maps ){
        maps = require( './menu' ).menuItemsMap
        tray.items = list;
        tray.maps = maps;
    }
    Object.entries( maps  ).forEach( (next)=>{
        const[ key, menu ] = next;
        let _iMenu:GenericMenuItem<GenericMenuList> = Object.assign( { ...menu } );
        _iMenu.click = ( )=>{
            if( typeof menu.click === "function" ) menu.click( tray, menu );
        }
        //@ts-ignore
        if( _iMenu.itemList ) _iMenu.itemList = menuRender( tray, transform, menu.itemList );
        let _transform = transform( _iMenu );
        _transform[ "click" ] = _iMenu.click;
        list.push( _transform );
    })
    return list;
}


export function prepare( menus?:GenericMenuMaps, identifiers?:string[], ...path){
    if( !menus ) menus = require( './menu' ).menuItemsMap;
    if( !identifiers ) identifiers = [];
    Object.entries( menus ).forEach( function (next) {
        let [ key, menu ] = next;
        let props:(keyof typeof menu)[] = [];
        // @ts-ignore
        props.push( ...Object.keys( menu ) );
        if( !props.includes( "enabled" ) ) menu.enabled = true;
        if( !menu.type ) menu.type = "normal";
        if( !menu.identifier ){
            menu.identifier = [...path, key ].join(".");
            if( identifiers.includes( menu.identifier ) ) menu.identifier = `${menu.identifier}#${ Math.trunc( Math.random()*999999999999999999999999999 )}`;
        }
        if( identifiers.includes( menu.identifier ) ) throw new Error( `Identifier ${ menu.identifier } already exists!`);
        if( menu.itemList ) prepare( menu.itemList );
    });
}



