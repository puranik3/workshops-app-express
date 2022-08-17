// file is not "included" in any script of the project. We run it separately.
require( 'dotenv' ).config();

const { exec } = require( 'child_process' );
const path = require( 'path' );

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;

const env = process.env.NODE_ENV;

let uri;

if( env === 'development' ) {
    uri = "";
} else if( env === 'production' ) {
    uri = `--uri="mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/workshopsDB?ssl=true&authSource=admin"`;
} 

exec( `mongoimport ${uri} --collection workshops --drop --file ${path.join( __dirname, 'seed/workshops.json')} --jsonArray`, ( err ) => {
    if( err ) {
        console.error( err.message );
        return;
    }

    console.log( 'successfully imported workshops documents' );
});

exec( `mongoimport ${uri} --collection topics --drop --file ${path.join( __dirname, 'seed/topics.json')} --jsonArray`, ( err ) => {
    if( err ) {
        console.error( err.message );
        return;
    }

    console.log( 'successfully imported topics documents' );
});

// some work is needed before uploading users as we need to hash passwords
// exec( `mongoimport ${uri} --collection users --drop --file ${path.join( __dirname, 'seed/users.json')} --jsonArray`, ( err ) => {
//     if( err ) {
//         console.error( err.message );
//         return;
//     }

//     console.log( 'successfully imported users documents' );
// });