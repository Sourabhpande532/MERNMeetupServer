const mongoose = require( "mongoose" );
function randomDate( start, end ) {
    return new Date( start.getTime() + Math.random() * ( end.getTime() - start.getTime() ) );
}

const SpeakerSchema = new mongoose.Schema( {
    name: { type: String, required: true },
    role: String,
    photoUrl: String
} )

const VenueSchema = new mongoose.Schema( {
    name: String,
    address: String,
    city: String,
    country: { type: String },
    latitude: Number,
    longitude: Number
} )

const EventSchema = new mongoose.Schema( {
    title: {
        type: String,
        required: true,
        trim: true
    },
    organizer: {
        type: String,
        default: "Unknown"
    },
    type: {
        type: String,
        enum: ["Online", "Offline"],
        default: Offline
    },
    startAt: {
        type: Date,
        required: true,
        default: () => randomDate( new Date( 2020, 0, 1 ), new Date() )
    },
    endAt: {
        type: Date,
        default: () => randomDate( new Date( 2020, 0, 1 ), new Date() )
    },
    timezone: {
        type: String,
        default: "UTC"
    },
    thumbnail: String,
    price: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: "INR"
    },
    description: String,
    venue: VenueSchema, // only for relevant for offline events
    speakers: [SpeakerSchema],
    capacity: Number,
    requiresTicket: {
        type: Boolean,
        default: false
    },
    createdBy: String,
    dressCode: { type: String, default: "Casual" },
    ageRestrication: {
        type: String,
        default: "None"
    },
    additionalInfo: String,
    tags: [{ type: String }],
}, { timestamps: true } )

const Meetup = mongoose.model( "MeetupEvents", EventSchema );
module.exports = Meetup;