import { StorageManager }  from 'zoo.util/lib/storage-manager';
import { folders } from "../../global/project";
import { app } from '../web.service';

// POST     $storage/path.../type
// GET      $storage/folder/path.../file.type
// PUT      $storage/folder/path.../file.type
// DELETE   $storage/folder/path.../file.type
export const storage:StorageManager = new StorageManager( folders.cloud, {
    defaultPath: "global"
});

//Images supports
storage.define( { type: "png",      folder: "images" } );
storage.define( { type: "jpeg",     folder: "images" } );
storage.define( { type: "jpg",      folder: "images" } );

//Videos supports
storage.define( { type: "mp4",      folder: "videos" } );
storage.define( { type: "mkv",      folder: "videos" } );
storage.define( { type: "flv",      folder: "videos" } );

//Documents supports
storage.define( { type: "pdf",      folder: "documents" } );
storage.define( { type: "json",     folder: "documents" } );
storage.define( { type: "xlsx",     folder: "documents" } );
storage.define( { type: "docx",     folder: "documents" } );

export const storageAccess = storage.listen({
    upload: { createParentPath: true }
});

export  { app };
