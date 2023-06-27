import {app, storage} from '../../../service/storage.service';

app.post("/api/search/customer", async (req, res) =>{
    const {functSearchCustomer} = require("../db/call-function-customer");
    const response = await functSearchCustomer(req.body);
    res.json({customer: response.rows});
});