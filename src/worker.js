const logger = require( 'logfmt' );
const throng = require( 'throng' );
const config = require( './config' ).all();
const App = require( './app' );
throng({
    start: startWorker,
    lifetime: Infinity,
    grace: 5000,
    workers: config.worker.concurrency
} );
//startWorker( 0 );

function startWorker( workerId ) {
    logger.log( {
        type: 'info',
        msg: 'starting worker',
        worker: workerId,
        concurrency: config.worker.concurrency
    } );
    /* init app core */
    config.app.worker = workerId;
    let app = new App( config.app );
    app.on( 'ready', start );
    app.on( 'lost', shutdown );
    app.connect();
    /**
     * Start worker
     */
    function start() {
        process.on( 'SIGINT', shutdown );
        app.startQueueSubscriber();
    }
    /**
     * Shutdown worker
     */
    async function shutdown() {
        logger.log( {
            type: 'info',
            msg: 'shutting down'
        } );
        await app.disconnect();
        logger.log( {
            type: 'info',
            msg: 'shutdown complete'
        } );
        process.exit( 0 );
    }
}
