import {Resource} from "kitres";
import {pgCore} from "./index";
import {MaguitaCatalog} from "../../../../database/cataloger/lumaguita";

export const dbRes = new Resource<MaguitaCatalog>( pgCore, {} );