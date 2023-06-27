import {checkLicenseValida} from "./validator";
import { app } from "../../../service/web.service";
app.get( "/",  checkLicenseValida );
app.get( "/admin",  checkLicenseValida );
app.get( "/pos",  checkLicenseValida );