const logger = require( 'logfmt' );
const EventEmitter = require( 'events' );
const services = require( './services' );

/**
 * Application Core
 *
 */
class App extends EventEmitter {
    get settings() {
        return this._settings;
    }
    /**
     * App Constructor
     *
     */
    constructor( config ) {
        super();
        this._settings = config;
        this.exchange = {};
        this.setupConnectionsListeners();
    }
    /**
     * Setup Listeners for Connections Class
     *  - When all connections are established emit ready to app listeners
     *    and create exchanger on RabbitMQ service.
     *  - When one service connection is lost and reconnects fail,
     *    emit lost to app listerners.
     */
    setupConnectionsListeners() {
         services.once( 'ready', async () => {
            await this.createExchanger();
            this.emit( 'ready' );
        } );
        services.once( 'lost', () => {
            this.emit( 'lost' );
        } )
    }
    /**
     * Connect App to Services
     * Defined services are MongoDB and RabbitMQ.
     */
    connect() {
        services.connect( this.settings.services );
    }
    /**
     * Disconnect all services
     */
    async disconnect() {
        await services.disconnect();
    }
    /**
     * Connect functionality to queue subscribers.
     * Every queue key is here connected to it's specific method which handle
     * the queue entries.
     */
    startQueueSubscriber() {
        let worker = this.settings.worker;
        if (this.exchange) {
            services.rabbitmq.queue( 'picsurfer.queue', ( queue ) => {
                queue.bind( this.exchange, 'doSomething', () => {
                    queue.subscribe( async ( message, headers, properties ) => {
                        logger.log( {
                            type: "info",
                            service: "get to do something",
                            msg: message.data.toString(),
                            worker: this.settings.worker
                        });
                        //await do something here;
                    } );
                } );
            });
        }
    }
    /**
     * Create a specific RabbitMQ Exchange
     * and make it awailable via this.excahnge.
     * The exchange can be used to publish a message and to connect to it's queue.
     * The createExchanger method is automaticali called on this.connect method.
     */
    createExchanger() {
        services.rabbitmq.exchange( 'picsurfer.queue', {
            type: 'direct'
        }, ( exchange ) => {
            logger.log( {
                type: "info",
                msg: "Exchange for publisher picsurfer.queue startet",
                service: "rabbitmq",
                worker: this.settings.worker
            } );
            this.exchange = exchange;
        } );
    }
}
module.exports = App;
