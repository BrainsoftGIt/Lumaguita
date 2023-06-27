"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare = exports.menuRender = exports.GENERIC_SEPARATOR = void 0;
exports.GENERIC_SEPARATOR = { title: "<SEPARATOR>", tooltip: "", type: "separator" };
function menuRender(tray, transform, maps) {
    let list = [];
    if (!maps) {
        maps = require('./menu').menuItemsMap;
        tray.items = list;
        tray.maps = maps;
    }
    Object.entries(maps).forEach((next) => {
        const [key, menu] = next;
        let _iMenu = Object.assign(Object.assign({}, menu));
        _iMenu.click = () => {
            if (typeof menu.click === "function")
                menu.click(tray, menu);
        };
        //@ts-ignore
        if (_iMenu.itemList)
            _iMenu.itemList = menuRender(tray, transform, menu.itemList);
        let _transform = transform(_iMenu);
        _transform["click"] = _iMenu.click;
        list.push(_transform);
    });
    return list;
}
exports.menuRender = menuRender;
function prepare(menus, identifiers, ...path) {
    if (!menus)
        menus = require('./menu').menuItemsMap;
    if (!identifiers)
        identifiers = [];
    Object.entries(menus).forEach(function (next) {
        let [key, menu] = next;
        let props = [];
        // @ts-ignore
        props.push(...Object.keys(menu));
        if (!props.includes("enabled"))
            menu.enabled = true;
        if (!menu.type)
            menu.type = "normal";
        if (!menu.identifier) {
            menu.identifier = [...path, key].join(".");
            if (identifiers.includes(menu.identifier))
                menu.identifier = `${menu.identifier}#${Math.trunc(Math.random() * 999999999999999999999999999)}`;
        }
        if (identifiers.includes(menu.identifier))
            throw new Error(`Identifier ${menu.identifier} already exists!`);
        if (menu.itemList)
            prepare(menu.itemList);
    });
}
exports.prepare = prepare;
//# sourceMappingURL=engine.js.map