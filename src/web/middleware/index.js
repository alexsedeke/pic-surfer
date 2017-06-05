/**
 * Compose Middleware
 * for CORS and bodyParser
 *
 * @author    Jan Nahody {@link http://nahody.github.io}
 * @copyright Copyright (c) 2017, Jan Nahody <jan.nahody@gmail.com>
 * @license   Apache-2.0
 */
const compose = require("koa-compose");
const cors = require("kcors");
const bodyParser = require("koa-bodyparser");
const appPassport = require("./passport.js");

module.exports = function middleware( config, app ) {
    let passport = appPassport(app);
    return compose( [
        cors( config.cors ),
        bodyParser(),
        passport.initialize()
    ] );
}
