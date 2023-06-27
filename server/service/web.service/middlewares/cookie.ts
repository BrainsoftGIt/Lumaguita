import { app } from "../index";

const cookieParser = require( 'cookie-parser' );
app.use( cookieParser() );