const { initializeDatabase } = require( "./db/db.connect" )
const express = require( "express" );
const cors = require( "cors" );
const app = express();
initializeDatabase();

const corsOptions = {
    origin: "*",
    credential: true,
    optionSuccessStatus: 200
}
app.use( express.json() );
app.use( cors( corsOptions ) )
const NewEvents = require( "./model/event.model" );

app.get( "/", ( req, res ) => {
    res.send( "Hello, This is meetup app on server." )
} )

async function addEventToDatabase( newEvent ) {
    try {
        const event = new NewEvents( newEvent )
        const savedEvent = await event.save();
        console.log( 'Event saved' );
        return savedEvent;
    } catch ( error ) {
        console.error( "Failed to add data", error.message );
        throw error
    }
}

app.post( "/events", async ( req, res ) => {
    try {
        const payload = req.body;
        // server side validation 
        const { title, startAt, endAt } = payload;
        if ( !title || !startAt || !endAt ) {
            return res.status( 400 ).json( { success: false, message: "Missing required fields: title/startAt/endAt" } )
        }
        const eventInformation = await addEventToDatabase( payload );
        if ( eventInformation ) {
            res.status( 201 ).json( eventInformation );
        } else {
            res.status( 404 ).json( { success: false, message: "data not found." } )
        }
    } catch ( error ) {
        console.error( "Server error", error.message );
        res.status( 500 ).json( { success: false, message: "Internal server, failed to add event", error: error.message } )
    }
} )

async function getAllEvents() {
    try {
        const allEvents = await NewEvents.find()
        console.log( "Fetch successfully all events!");
        return allEvents;
    } catch ( error ) {
        console.error( "Failed to get events.", error.message )
        throw error
    }
}

app.get( "/eventList", async ( req, res ) => {
    try {
        const listedEvent = await getAllEvents();
        if ( listedEvent.length > 0 ) {
            res.status( 200 ).json( listedEvent )
        } else {
            res.status( 404 ).json( { success: false, message: "event not found" } )
        }
    } catch ( error ) {
        console.error( "Crated servererror:", error.message );
        res.status( 500 ).json( { success: false, message: "Server error while fetching events", err: error.message } )
    }
} )

async function readEventByTitle( eventTitle ) {
    try {
        const titleByEvents = await NewEvents.find( { title: eventTitle } );
        console.log( "Event Get by title Done!" );
        return titleByEvents
    } catch ( error ) {
        console.error( "Failed to get event.", error.message );
        throw error;
    }
}

app.get( "/events/title/:titleName", async ( req, res ) => {
    try {
        const getTitleBySearch = await readEventByTitle( req.params.titleName );
        if ( getTitleBySearch.length > 0 ) {
            res.status( 201 ).json( getTitleBySearch )
        } else {
            res.status( 404 ).json( { success: false, message: "event not found." } )
        }
    } catch ( error ) {
        console.error( "Failed sever error", error.message );
        res.status( 500 ).json( { message: "Server internal error", err: error.message } )
    }
} )

async function readEventMode( type ) {
    try {
        const eventHost = await NewEvents.find( { type } );
        console.log( "Preferred mode:" );
        return eventHost
    } catch ( error ) {
        console.error( "Failed to select mode:", error.message );
        throw error
    }
}
app.get( "/events/:eventMode", async ( req, res ) => {
    try {
        const resultEvent = await readEventMode( req.params.eventMode );
        if ( resultEvent.length != 0 ) {
            res.status( 200 ).json( resultEvent )
        } else {
            res.status( 404 ).json( { message: "event not found.", err: error.message } )
        }
    } catch ( error ) {
        console.log( "server error:", error.message );
        res.status( 500 ).json( { err: error, message: 'Server error, prefer mode either online/offline' } )
    }
} )

const PORT = process.env.PORT || 4000;
app.listen( PORT, () => {
    console.log( `The server is running on http://localhost:${ PORT }` );
} )