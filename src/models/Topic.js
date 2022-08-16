const mongoose = require( 'mongoose' );

const topicSchema = new mongoose.Schema({
    workshop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workshop', // the name the related Model is registered with
        required: true
    },
    name: {
        type: String,
        required: true
    },
    durationInHours: {
        type: Number,
        min: 0
    }
});

mongoose.model( 'Topic', topicSchema );