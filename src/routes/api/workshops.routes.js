const express = require( 'express' );
const {
    authenticate,
    authorize
} = require( '../../middleware/auth' );
const {
    getWorkshops,
    getWorkshopById,
    postWorkshop,
    patchWorkshop,
    addSpeakers,
    deleteWorkshop,
    postTopic,
    getTopics,
    generateWorkshopsPdf
} = require( '../../controllers/api/workshops.controller' );

const router = express.Router();

router.get( '/', getWorkshops );
router.get( '/:id', getWorkshopById )
router.post( '/', authenticate, authorize( [ 'admin' ] ), postWorkshop );
router.patch( '/:id', authenticate, authorize( [ 'admin' ] ),patchWorkshop );
router.patch( '/:id/speakers', authenticate, authorize( [ 'general' ] ), addSpeakers );
router.delete( '/:id', authenticate, authorize( [ 'admin' ] ), deleteWorkshop );
router.get( '/:id/topics', getTopics );
router.post( '/:id/topics', postTopic );
router.post( '/generate-pdf', generateWorkshopsPdf )

module.exports = router;