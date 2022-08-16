const mongoose = require( 'mongoose' );
const timeSchema = require( './Time' );

/**
 * In MongoDB, the documents can store related information together
 * For example, we can store, the topics for a particular workshop, in the workshop document as an array, say "topics".
 */

const workshopSchema = new mongoose.Schema({
    // name: String,
    // topics: {
    //     type: [ mongoose.Schema.Types.ObjectId ]
    // },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: 'This is a tech workshop'
    },
    speakers: {
        type: [ String ],
        required: true
    },
    category: {
        type: String,
        enum: [ 'frontend', 'backend' ]
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: timeSchema,
        required: true
    },
    endTime: {
        type: timeSchema,
        required: true
    },
    modes: {
        online: {
            type: Boolean,
            default: true
        },
        inPerson: {
            type: Boolean,
            default: true
        }
    }
    // prefer this as far as possible
    // topics: {
    //     type: [
    //         topicSchema
    //     ]
    // }
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

// inverse relationship is set up (Workshop -> Topic)
workshopSchema.virtual( 'topics', {
    ref: 'Topic',
    localField: '_id',
    foreignField: 'workshop' // the field in the other collection (Topic) that references a document in this collection (Workshop)
})

// Model is a class that has various methods to query and update the workshops collection
// NOTE: Mongoose will create a new model (a class), and register the class with the name 'Workshop' (a string).
/*const Workshop = */mongoose.model( 'Workshop', workshopSchema/*, 'workshops' */ );