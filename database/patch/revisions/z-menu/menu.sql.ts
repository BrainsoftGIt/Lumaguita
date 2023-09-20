import {block} from "../../core/updater";

block( module, {
    identifier: "lumaguita-menus"
}).sql`
    with ___menu (menu_id, menu_menu_id, menu_codigo, menu_raiz, menu_nivel, menu_icon, menu_nome, menu_link, menu_estado, menu_children, menu_maxnode, menu_directchildern, menu_position) as (
        VALUES (115, null, 'maguita.nota.credito', '', 0, e'<?xml version="1.0" encoding="iso-8859-1"?>
    <!-- Generator: Adobe Illustrator 22.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 100.25 100.25" style="enable-background:new 0 0 100.25 100.25;" xml:space="preserve">
    <path d="M79.567,29.924l-18.26-18.479C61.025,11.16,60.641,11,60.24,11H20.5c-0.828,0-1.5,0.672-1.5,1.5v75
    c0,0.828,0.672,1.5,1.5,1.5h58c0.828,0,1.5-0.672,1.5-1.5V30.979C80,30.585,79.845,30.206,79.567,29.924z M62,16.415L74.929,29.5H62
    V16.415z M22,86V14h37v17c0,0.828,0.672,1.5,1.5,1.5H77V86H22z"/>
    </svg>', 'Nota Credito', '../includes/notaCredito.html', 1, 0, 0, 0, 3),
    (116, 71, 'maguita.pos.report', '71', 1, null, 'Relatório', null,1,0,0,0,0)
    ) select lib.sets( jsonb_populate_record( null::auth.menu, to_jsonb( m ) ) )
    from ___menu m ;

`;
