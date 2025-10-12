const mongoose = require( "mongoose" );
function randomDate( start, end ) {
    return new Date( start.getTime() + Math.random() * ( end.getTime() - start.getTime() ) );
}
const EventSchema = new mongoose.Schema( {
    title: { type: String, required: true },
    date: { type: Date, required: true, default: () => randomDate( new Date( 2020, 0, 1 ), new Date() ) },
    type: { type: String, default: "Both" },
    imageSrc: { type: String },
}, { timestamps: true } )

const Meetup = mongoose.model( "MeetupEvents", EventSchema );
module.exports = Meetup;