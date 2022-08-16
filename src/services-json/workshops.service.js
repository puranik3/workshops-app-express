const workshops = require( './data/workshops.json' );

let nextId = 13;

const getAllWorkshops = ( page, sortField ) => {
    const startIndex = 10 * ( page - 1 );
    const endIndex = 10 * page;

    const sortedWorkshops = workshops.sort(( w1, w2 ) => {
        if( w1[sortField] < w2[sortField] ) {
            return -1;
        }

        if( w1[sortField] > w2[sortField] ) {
            return 1;
        }

        return 0;
    });

    return sortedWorkshops.slice( startIndex, endIndex );
};

const getWorkshopById = ( id ) => {
    return workshops.find( workshop => workshop.id === id );
};

const addWorkshop = ( workshop ) => {
    workshop.id = 13;
    workshops.push( workshop );
    
    return workshop;
};

module.exports = {
    getAllWorkshops,
    getWorkshopById,
    addWorkshop
};