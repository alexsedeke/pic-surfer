const mongoose = require( 'mongoose' );
const amqp = require( 'amqp' );
const logger = require( 'logfmt' );
const EventEmitter = require( 'events' );
/**
 * Application external service connections
 *
 */
class Services extends EventEmitter {
    /**
     * Class constructor
     *
     */
    constructor() {
        super();
        this.mongooseListeners();
        this.rabbitmq = null;
        this.isRabbitmqConnected = null;
    }
    /**
     * Connect all services
     *
     */
    connect( params ) {
        if( params.mongoURI ) {
            mongoose.connect( params.mongoURI, params.mongoOptions );
        }
        if( params.amqp ) {
            this.rabbitmq = amqp.createConnection( params.amqp  )
                .on( 'ready', () => {
                    logger.log( {
                        type: 'info',
                        msg: 'connected',
                        service: 'rabbitmq'
                    } );
                    this.isRabbitmqConnected = true;
                    this.onReady();
                } ).on( 'error', ( err ) => {
                    logger.log( {
                        type: 'error',
                        msg: err,
                        service: 'rabbitmq'
                    } );
                    this.isRabbitmqConnected = false;
                    this.onLost();
                } );
        }
    }
    /**
     * Disconnect from all services
     *
     */
    disconnect() {
        if( mongoose.connection.db ) {
            mongoose.disconnect();
        }

        if ( this.rabbitmq ) {
             this.rabbitmq.disconnect();
             this.isRabbitmqConnected = false;
             logger.log( {
                 type: 'info',
                 msg: 'closed',
                 service: 'rabbitmq'
             } );
        }
    }
    /**
     * Connect Mongo DB
     *
     * Mongoose connect URL:
     * mongodb://username:password@host:port/database?options...
     */
    mongooseListeners() {
        mongoose.connection.on( "connected", () => {
            logger.log( {
                type: "info",
                msg: "connected",
                service: "mongodb"
            } );
            this.onReady();
        } );
        mongoose.connection.on( "error", ( err ) => {
            logger.log( {
                type: "error",
                msg: err,
                service: "mongodb"
            } );
            //  Handling max connection retries reached
            // so we send lost emmiter
            if( mongoose.connection.db ) {
                this.onLost();
            }
        } );
        mongoose.connection.on( "close", () => {
            logger.log( {
                type: "info",
                msg: "closed",
                service: "mongodb"
            } );
        } );
        mongoose.connection.on( "disconnected", () => {
            logger.log( {
                type: "info",
                msg: "disconnected",
                service: "mongodb"
            } );
        } );
    }
    /**
     * Broadcast when one connection is lost.
     *
     */
    onLost() {
        this.emit( 'lost' );
    }
    onReady() {
        if( mongoose.connection.db && this.isRabbitmqConnected ){
            this.emit( "ready" );
        }
    }
}
module.exports = new Services();
