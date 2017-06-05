const logger = require( 'logfmt' );
const EventEmitter = require( 'events' );
const connections = require( './connections' );
const Photo = require( './photo' );
const chokidar = require( 'chokidar' );
/**
 * Application Core
 *
 */
class App extends EventEmitter {
    /**
     * App Constructor
     *
     */
    constructor( config ) {
        super();
        this.config = config;
        this.exchange = {};
        this.photo = new Photo(config);
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
         connections.once( 'ready', async () => {
            await this.createExchanger();
            this.emit( 'ready' );
        } );
        connections.once( 'lost', () => {
            this.emit( 'lost' );
        } )
    }
    /**
     * Connect App to Services
     * Defined services are MongoDB and RabbitMQ.
     */
    connect() {
        connections.connect( this.config.services );
    }
    /**
     * Disconnect all service  connections
     */
    async disconnect() {
        await connections.disconnect();
    }
    /**
     * Connect functionality to queue subscribers.
     * Every queue key is here connected to it's specific method which handle
     * the queue entries.
     */
    startQueueSubscriber() {
        let worker = this.config.worker;
        if (this.exchange) {
            connections.rabbitmq.queue( 'kakao.queue', ( queue ) => {
                queue.bind( this.exchange, 'fileImport', () => {
                    queue.subscribe( async ( message, headers, properties ) => {
                        logger.log( {
                            type: "info",
                            service: "photo file import",
                            msg: message.data.toString(),
                            worker: this.config.worker
                        });
                        await this.photo.importPhoto( message.data.toString() );
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
        connections.rabbitmq.exchange( 'kakao.queue', {
            type: 'direct'
        }, ( exchange ) => {
            logger.log( {
                type: "info",
                msg: "Exchange for publisher kakao.queue startet",
                service: "rabbitmq",
                worker: this.config.worker
            } );
            this.exchange = exchange;
        } );
    }
    /**
     * Watch import folder
     * and add new queue message on new files.
     * The path parameter is optional. When no parameter is entered
     * the Application importFolder settings is used.
     * Caution: The function have to be startet on single process only!
     *
     * @param path {string} (optional) Relative or absolute path to import folder.
     * @return watcher {object} chokidar object.
     */
    watchFolder( path ) {
        let watcher = chokidar.watch( path || this.config.import.folder, {
            ignored: /(^|[\/\\])\../,
            persistent: true
        } );

        watcher.on('add', path => {
            this.exchange.publish('fileImport', path);
        });

        return watcher;
    }
}
module.exports = App;
