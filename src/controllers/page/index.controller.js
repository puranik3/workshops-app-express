const path = require( 'path' );

// Method = GET
// req, res -> same as in Node JS but with extra features
const showHome = ( req, res ) => {
    // res.send() adds Response header - 'Content-Type': 'text/html'
    // res.send( 'This is the workshops app' );

    res.render( 'home', {
        title: req.app.get( 'title' )
    } );
};

const redirectToHome = ( req, res ) => {
    // tell the browser to make request to / instead. On receiving this response, the browser makes a new request to /
    res.redirect( '/' );
};

// router.get( '/about', ( req, res ) => {
//     res.send(
//         `
//             <!doctype html>
//             <html>
//                 <head>
//                     <title>About | Workshops App</title>
//                 </head>
//                 <body>
//                     <h1>Workshops App</h1>
//                     <hr />
//                     This is the workshops app. You can view details of workshops nearby.
//                 </body>
//             </html>
//         `
//     );
// });
const showAbout = ( req, res ) => {
    // process.cwd() -> path from which we start node (npm start), i.e. the project folder
    res.sendFile( path.join( process.cwd(), 'views', 'about.html' ) );
};

module.exports = {
    showHome,
    redirectToHome,
    showAbout
};