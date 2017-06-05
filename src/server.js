/**
* Web start process
*
* @author    Jan Nahody {@link http://nahody.github.io}
* @copyright Copyright (c) 2017, Jan Nahody
* @license   Apache-2.0
*/
const logger = require( 'logfmt' );
const cpus = require( 'os' ).cpus().length;
const http = require( 'http' );
const throng = require( 'throng' );
const App = require( './app' );
const web = require( './web' );
const config = require( './config' ).all();

http.globalAgent.maxSockets = Infinity;
// throng( {
//     start: startServer,
//     lifetime: Infinity,
//     grace: 5000,
//     workers: config.web.concurrency
// } );
startServer(0);

/**
 * Start web server and services method for throng.
 *
 * Create new App Instance. On successful App start and connections
 * start web service (koa2).
 */
function startServer( workerId ) {
    logger.log( {
        type: 'info',
        msg: 'starting web server',
        worker: workerId,
        concurrency: config.web.concurrency
    } );
    /* init app core */
    config.app.worker = workerId;
    let app = new App( config.app );
    let server = http.createServer( web( config.web, app ).callback() );
    // app.on( 'ready', start );
    // app.on( 'lost', shutdown );
    app.connect();
    start();

    /**
     * Start web server
     */
    function start() {
        process.on( 'SIGINT', shutdown);
        /*
         * Start listening web server
         */
        server.listen( process.env.PORT || config.web.port, isListening );

        function isListening() {
            logger.log( {
                type: "info",
                msg: "listening",
                service: "server",
                port: server.address().port
            } );

            //app.startPublish();
        }
    }

    /**
     * Shutdown web server and disconnect app connections
     */
    async function shutdown() {
        logger.log( {
            type: 'info',
            msg: 'shutting down',
            service: "server"
        } );
        await app.disconnect();
        process.exit(0);
    }
}
