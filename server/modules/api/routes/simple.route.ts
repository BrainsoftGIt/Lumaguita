import { app } from '../../../service/web.service';
import { storage } from '../../../service/storage.service';

// Accept get and post file in [storage]/contents/attaches
storage.accept( {
    path: "contents/attaches",
    method: [ "POST", "GET" ],
    check: (request) => true
});


// Accept only get file on route [storage]/contents
storage.accept( {
    path: "contents",
    method: [ "GET" ],
    check: (request) => true
});

// app.post("/api/simple", async (req, res) =>{
//     res.send( "SIMPLE [POST] ROUTE")
// });
//
// app.get("/api/simple", async (req, res) =>{
//     res.send( "SIMPLE [GET] ROUTE")
// });
