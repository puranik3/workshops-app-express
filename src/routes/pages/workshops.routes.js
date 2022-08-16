const express = require( 'express' );
const {
    showWorkshops,
    showWorkshopById
} = require( '../../controllers/page/workshops.controller' );

const router = express.Router();

router.get( '/', showWorkshops );
router.get( '/:id', showWorkshopById );

module.exports = router;