const path = require( 'path' );
const multer = require( 'multer' );

const storage = multer.diskStorage({
    destination( req, file, done ) {
        const publicPath = '/images/profile-pics';
        req.publicPath = publicPath;
        
        const destination = path.join( process.cwd(), 'public', publicPath );
        done( null, destination );
    },
    filename( req, file, done ) {
        req.filename = file.originalname;
        done( null, req.filename );
    }
});

const fileFilter = ( req, file, done ) => {
    const extension = path.extname( file.originalname ).toUpperCase();

    const allowedExtensions = [ '.JPG', 'JPEG', '.PNG' ];
    
    if( !allowedExtensions.includes( extension ) ) {
        const error = new HttpError( 'Allowed file extension are .jpg, .jpeg and .png' );
        done( error );
        return;
    }

    done( null, true );
};

const upload = multer({
    // storage: storage,
    storage,
    fileFilter,
    limits: {
        fileSize: 2 ** 20 // 1 MB (2^20 bytes)
    }
});

module.exports = upload;