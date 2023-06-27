import {app} from "../../../service/web.service";
import {checkLicenseValida} from "./validator";

app.use( "/api",  checkLicenseValida );