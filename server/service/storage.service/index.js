"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.storageAccess = exports.storage = void 0;
const storage_manager_1 = require("zoo.util/lib/storage-manager");
const project_1 = require("../../global/project");
const web_service_1 = require("../web.service");
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return web_service_1.app; } });
// POST     $storage/path.../type
// GET      $storage/folder/path.../file.type
// PUT      $storage/folder/path.../file.type
// DELETE   $storage/folder/path.../file.type
exports.storage = new storage_manager_1.StorageManager(project_1.folders.cloud, {
    defaultPath: "global"
});
//Images supports
exports.storage.define({ type: "png", folder: "images" });
exports.storage.define({ type: "jpeg", folder: "images" });
exports.storage.define({ type: "jpg", folder: "images" });
//Videos supports
exports.storage.define({ type: "mp4", folder: "videos" });
exports.storage.define({ type: "mkv", folder: "videos" });
exports.storage.define({ type: "flv", folder: "videos" });
//Documents supports
exports.storage.define({ type: "pdf", folder: "documents" });
exports.storage.define({ type: "json", folder: "documents" });
exports.storage.define({ type: "xlsx", folder: "documents" });
exports.storage.define({ type: "docx", folder: "documents" });
exports.storageAccess = exports.storage.listen({
    upload: { createParentPath: true }
});
//# sourceMappingURL=index.js.map