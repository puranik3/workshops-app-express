const { getAllWorkshops, getWorkshopById } = require( '../../services/workshops.service' );

const showWorkshops = ( req, res ) => {
    const workshops = getAllWorkshops();
    res.render( 'workshops', {
        workshops,
        title: req.app.get( 'title' )
    });
};

// GET /workshops/1, /workshops/2, ...
const showWorkshopById = ( req, res ) => {
    const id = +req.params.id; // '1', '2', etc

    const workshop = getWorkshopById( id );
    
    res.render( 'workshop-details', {
        workshop,
        title: req.app.get( 'title' )
    });
};

module.exports = {
    showWorkshops,
    showWorkshopById
};