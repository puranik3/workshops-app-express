const {
    getAllWorkshops,
    // renaming while destructuring since there is a function with the same name in this file as well
    getWorkshopById : getWorkshopByIdSvc,
    addWorkshop,
    updateWorkshop,
    addSpeakers : addSpeakersSvc,
    deleteWorkshop : deleteWorkshopSvc,
    generateWorkshopsPdf: generateWorkshopsPdfSvc
} = require( '../../services/workshops.service' );
const TopicsService = require( '../../services/topics.service' );

// http://localhost:3000/api/workshops
// http://localhost:3000/api/workshops?page=2&sort=name
const getWorkshops = async ( req, res ) => {
    let { page, sort : sortField } = req.query;

    if( page ) {
        page = +page;
    } else {
        page = 1;
    }

    const workshops = await getAllWorkshops( page, sortField );
    // send(), redirect(), json(), sendFile(), render()
    res.status( 200 ).json({
        status: 'success',
        data: workshops
    });
};

// http://localhost:3000/api/workshops/:id
const getWorkshopById = async ( req, res, next ) => {
    const id = req.params.id;

    try {
        const workshop = await getWorkshopByIdSvc( id );

        res.status( 200 ).json({
            status: 'success',
            data: workshop
        });
    } catch( error ) {
        const httpError = new HttpError( error.message, 404 ); // 404 -> not found

        next( httpError );
    }
};

const postWorkshop = async ( req, res, next ) => {
    console.log( 'claims = ', res.locals.claims );
    
    const workshop = req.body;
    
    try {
        let updatedWorkshop = await addWorkshop( workshop );
        
        res.status( 201 ).json({
            status: 'success',
            data: updatedWorkshop
        });
    } catch( error ) {
        const httpError = new HttpError( error.message, 400 );

        next( httpError );
    }
};

const patchWorkshop = async ( req, res, next ) => {
    const id = req.params.id;

    const workshop = req.body;
    
    // if workshop = req.body -> {}
    if( Object.keys( workshop ).length === 0 ) {
        const httpError = new HttpError( "Body is missing", 400 );

        next( httpError );
        return;
    }

    try {
        const updatedWorkshop = await updateWorkshop( id, workshop );
        res.status( 200 ).json({
            status: 'success',
            data: updatedWorkshop
        });
    } catch( error ) {
        const httpError = new HttpError( error.message, 404 );

        next( httpError );
    }
};

// http://localhost:3000/api/workshops/62ed07b0437f58e437c01f57/speakers
// body -> [
//     "john.doe@example.com",
//     "jane.doe@example.com"
// ]
const addSpeakers = async ( req, res, next ) => {
    const id = req.params.id;
    const speakers = req.body;

    if( !( speakers instanceof Array ) || speakers.length === 0 ) {
        const httpError = new HttpError( "Speakers must be a non-empty array. Data is missing or formed incorrectly", 400 );

        next( httpError );
        return;
    }

    try {
        const updatedWorkshop = await addSpeakersSvc( id, speakers );
        res.status( 200 ).json({
            status: 'success',
            data: updatedWorkshop
        });
    } catch( error ) {
        const httpError = new HttpError( error.message, 404 );

        next( httpError );
    }
};

const deleteWorkshop = async ( req, res, next ) => {
    const id = req.params.id;

    try {
        await deleteWorkshopSvc( id );
        // 204 -> use this status code for successful operation but you do not want to send any data in response
        res.json({
            status: 'success'
        });
    } catch( error ) {
        const httpError = new HttpError( error.message, 404 );

        next( httpError );
    }
};

// Sample: http://localhost:3000/api/workshops/62ed150ad0d302eca77f0f38/topics
const getTopics = async ( req, res, next ) => {
    const workshopId = req.params.id;

    try {
        const topics = await TopicsService.getTopics( workshopId );
        res.status( 200 ).json({
            status: 'success',
            data: topics
        });
    } catch( error ) {
        if( error.type === 'CastError' ) {
            const httpError = new HttpError( error.message, 400 );
            next( httpError );
        } else if( error.type === 'NotFound' ) {
            const httpError = new HttpError( error.message, 404 );
            next( httpError );
        }
    }
};

const postTopic = async ( req, res, next ) => {
    const workshop = req.params.id;
    const topic = {
        // workshop: workshop,
        workshop,
        ...req.body
    };
    
    try {
        let updatedTopic = await TopicsService.addTopic( topic );
        
        res.status( 201 ).json({
            status: 'success',
            data: updatedTopic
        });
    } catch( error ) {
        const httpError = new HttpError( error.message, 400 );

        next( httpError );
    }
};

const generateWorkshopsPdf = async ( req, res, next ) => {
    await generateWorkshopsPdf()
};

module.exports = {
    getWorkshops,
    getWorkshopById,
    postWorkshop,
    patchWorkshop,
    addSpeakers,
    deleteWorkshop,
    getTopics,
    postTopic,
    generateWorkshopsPdf
};