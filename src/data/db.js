const mongoose = require( 'mongoose' );

mongoose.set( 'returnOriginal', false );
mongoose.set( 'runValidators', true );

// define the Models
require( '../models/User' );
require( '../models/Workshop' );
require( '../models/Topic' );

const env = process.env.NODE_ENV;

const connect = async () => {
    try {
        // NODE_ENV = 'development' | 'production' | 'staging' | 'test'
        if( env === 'development' ) {
            await mongoose.connect( `mongodb://localhost:27017/workshopsDB` );
        } else if( env === 'production' ) {
            const dbUser = process.env.DB_USER;
            const dbPassword = process.env.DB_PASSWORD;
            const dbHost = process.env.DB_HOST;

            await mongoose.connect( `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/workshopsDB?retryWrites=true&w=majority` );
        }
        
        console.log( 'connected to db' );

        // Unfortunately, we cannot install tools like mongoimport
        // require( './init.js' );
    } catch( error ) {
        console.error( error.message );
        process.exit( 1 );
    }
};

module.exports = {
    connect
}