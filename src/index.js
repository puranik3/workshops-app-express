require( 'dotenv' ).config();

require( './init' );

const { connect } = require( './data/db' );
connect();

const path = require( 'path' );
const express = require( 'express' );
const cors = require( 'cors' );
const morgan = require( 'morgan' );
const indexRouter = require( './routes/pages/index.routes' );
const workshopsRouter = require( './routes/pages/workshops.routes' );
const usersApiRouter = require( './routes/api/users.routes' );
const workshopsApiRouter = require( './routes/api/workshops.routes' );
const topicsApiRouter = require( './routes/api/topics.routes' );

const logger = require( './middleware/logger' );
const {
    apiNotFound,
    pageNotFound,
    errorHandler
} = require( './middleware/error' );

// Application object (has a web server within)
const app = express();

const env = process.env.NODE_ENV;
let origin = 'http://localhost:3001';

if( env === 'production' ) {
    origin = 'https://workshops-app-vue.herokuapp.com';
}

app.use(cors({
    origin,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// app allows us to store and share key-value pairs
// in router handlers, we can use req.app.get( 'title' ) to read this
app.set( 'title', 'Workshops App' );

app.set( 'view engine', 'ejs' );
app.set( 'views', path.join( process.cwd(), 'views' ) );

// app.use( logger );
app.use( morgan( 'combined' ) ); // 'combined' -> Apache HTTP server format for logs

// app.use(( req, res, next ) => {
//     console.log( 'A request was received (1) | req.url = ', req.url );
//     next();
// });

app.use( express.static( path.join( process.cwd(), 'public' ) ) );

// app.use(( req, res, next ) => {
//     console.log( 'A request was received (2) | req.url = ', req.url );
//     next();
// });

// if there is any data in the request body, this middleware will read it and set it up on req.body
app.use( express.json() );

// to take care of reading data submitted using a form
app.use( express.urlencoded() );

app.use( indexRouter );
app.use( '/workshops', workshopsRouter );

app.use( '/api/auth', usersApiRouter );
app.use( '/api/workshops', workshopsApiRouter );
app.use( '/api/topics', topicsApiRouter );

app.use( '/api', apiNotFound );
app.use( pageNotFound );
app.use( errorHandler );

const PORT = process.env.PORT || 3000;

app
    .listen( PORT, () => {
        console.log( `Server running on http://localhost:${PORT}` );
    }) // listen() returns server
    .on( 'error', error => { // server.on( ... )
        console.error( error.message );
    });