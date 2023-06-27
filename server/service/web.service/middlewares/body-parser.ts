import { app } from "../index";

const bodyParser = require( 'body-parser' );
app.use( bodyParser.json( { } ) );
app.use( bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.raw({ } ) );
app.use( bodyParser.text( { } ) );