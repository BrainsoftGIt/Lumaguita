import {args} from "../global/args";
import {context} from "../global/context";
import {catalog} from "../service/database.service/calatoger";
context.define( args );
catalog();