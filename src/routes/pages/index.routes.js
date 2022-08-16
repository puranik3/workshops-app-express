const express = require( 'express' );

const {
    showHome,
    redirectToHome,
    showAbout
} = require( '../../controllers/page/index.controller' );

const router = express.Router();

router.get( '/', showHome );
router.get( '/home', redirectToHome );
router.get( '/about', showAbout );

// just for fun
router.get( '/ping', ( req, res ) => {
    res.redirect( '/pong' );
});

router.get( '/pong', ( req, res ) => {
    res.redirect( '/ping' );
});

module.exports = router;