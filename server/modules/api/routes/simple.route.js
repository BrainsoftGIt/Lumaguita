"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_service_1 = require("../../../service/storage.service");
// Accept get and post file in [storage]/contents/attaches
storage_service_1.storage.accept({
    path: "contents/attaches",
    method: ["POST", "GET"],
    check: (request) => true
});
// Accept only get file on route [storage]/contents
storage_service_1.storage.accept({
    path: "contents",
    method: ["GET"],
    check: (request) => true
});
// app.post("/api/simple", async (req, res) =>{
//     res.send( "SIMPLE [POST] ROUTE")
// });
//
// app.get("/api/simple", async (req, res) =>{
//     res.send( "SIMPLE [GET] ROUTE")
// });
//# sourceMappingURL=simple.route.js.map