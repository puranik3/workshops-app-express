const mongoose = require( 'mongoose' );

mongoose.set( 'returnOriginal', false );
mongoose.set( 'runValidators', true );

// define the Models
require( '../models/User' );
require( '../models/Workshop' );
require( '../models/Topic' );

const connect = async () => {
    try {
        await mongoose.connect( `mongodb://localhost:27017/workshopsDB` );
        console.log( 'connected to db' );
    } catch( error ) {
        console.error( error.message );
        process.exit( 1 );
    }
};

module.exports = {
    connect
}