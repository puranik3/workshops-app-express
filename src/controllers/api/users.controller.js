const path = require( 'path' );
const jwt = require( 'jsonwebtoken' );
const {
    addUser,
    getUserByEmail,
    checkPassword,
    updateProfilePic
} = require( '../../services/users.service' );

const register = async ( req, res, next ) => {
    const user = req.body;

    // if user = req.body -> {}
    if( Object.keys( user ).length === 0 ) {
        const httpError = new HttpError( "Body is missing", 400 );

        next( httpError );
        return;
    }

    try {
        // updatedUser actually has many more details than the ones in the user document.
        const updatedUser = await addUser( user );
        const userToSend = {
            ...updatedUser.toObject()
        };
        delete userToSend.password;

        res.status( 201 ).json({
            status: 'success',
            data: userToSend // internally userToSend.toJSON() runs which returns details about the user that are part of the user document
        });
    } catch( error ) {
        const httpError = new HttpError( error.message, 400 );

        next( httpError );
    }
};

const login = async ( req, res, next ) => {
    const credentials = req.body;

    if( !( credentials?.email && credentials?.password ) ) {
        const httpError = new HttpError( "Bad request", 400 );

        next( httpError );
        return;
    }

    const { email, password } = credentials;

    try {
        const user = await getUserByEmail( email );
        // we are not done with user check
        // but let us respond with success for now
        await checkPassword( user, password );

        const claims = {
            role: user.role,
            email: user.email, // info useful for the backend in future request
        };

        // The secret key which is used to generate the digital signature must be stored in environment variable and NEVER in code
        jwt.sign( claims, process.env.JWT_SECRET, function( error, token ) {
            // some problem in generating JWT
            if( error ) {
                const httpError = new HttpError( "Internal Server Error", 500 );
                next( httpError );
            }

            res.json({
                status: 'success',
                data: {
                    name: user.name,
                    email: user.email, // useful for frontend app
                    // token: token
                    token
                }
            });
        });
    } catch( error ) {
        if( error.type === 'BadCredentials' ) {
            // Email, password is provided but is incorrect -> 403
            const httpError = new HttpError( "Bad credentials", 403 );
            next( httpError );
        } else {
            const httpError = new HttpError( "Internal Server Error", 500 );
            next( httpError );
        }
    }
};

const uploadProfileImage = async ( req, res, next ) => {
    const id = req.params.id;
    const { publicPath, filename } = req;

    const profilePic = path.join( publicPath, filename );

    try {
        await updateProfilePic( id, profilePic );
        
        res.status( 201 ).json({
            data: 'success',
            message: 'Your profile pic has been saved'
        });
    } catch( error ) {
        const httpError = new HttpError( "Internal Server Error", 500 );
        next( httpError );
    }
};

module.exports = {
    register,
    login,
    uploadProfileImage
};