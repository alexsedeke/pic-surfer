/**
 * Compose Middleware
 * for CORS and bodyParser
 *
 * @author    Jan Nahody {@link http://nahody.github.io}
 * @copyright Copyright (c) 2016, Jan Nahody <jan.nahody@gmail.com>
 * @license   Apache-2.0
 */
const compose = require("koa-compose");
const cors = require("kcors");
const bodyParser = require("koa-bodyparser");

module.exports = function middleware( config ) {
    return compose( [
        cors( config.cors ),
        bodyParser()
    ] );
}
