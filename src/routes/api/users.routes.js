const express = require( 'express' );
const {
    register,
    login,
    uploadProfileImage
} = require( '../../controllers/api/users.controller' );
const upload = require( '../../middleware/upload' );
const router = express.Router();

router.post( '/register', register );
router.post( '/login', login );

// 'profilePic' is the 'name' of the field in the form used to upload the file
// In frontend, for HTML
// <form action="/api/auth/upload-profile-image" method="POST" enctype="multipart/form-data">
//      <input type="file" name="profilePic" />
// </form>

// EXERCISE: Write a custom middleware generator (similar to the way we wrote authorize) which will be passed which folder, the file should be uploaded to (it will set this info on the req object for the next middleware to use)
router.post( '/:id/profile-image', /*uploadFolder( 'profile-pic' ), */ upload.single( 'profilePic' ), uploadProfileImage );

module.exports = router;