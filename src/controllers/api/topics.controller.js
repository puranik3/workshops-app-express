const {
    addTopic
} = require( '../../services/topics.service' );

const postTopic = async ( req, res, next ) => {
    const topic = req.body;
    
    try {
        let updatedTopic = await addTopic( topic );
        
        res.status( 201 ).json({
            status: 'success',
            data: updatedTopic
        });
    } catch( error ) {
        const httpError = new HttpError( error.message, 400 );

        next( httpError );
    }
};

module.exports = {
    postTopic
}