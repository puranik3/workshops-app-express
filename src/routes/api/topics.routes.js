const express = require( 'express' );
const {
    authenticate,
    authorize
} = require( '../../middleware/auth' );
const {
    postTopic
} = require( '../../controllers/api/topics.controller' );

const router = express.Router();

router.post( '/', postTopic );

module.exports = router;