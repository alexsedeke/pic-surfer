/**
 * Serve
 * is the entry point for all required settings for serving somethink like application/api can be set.
 *
 * Serve holds setting for global error handling, error and user logging.
 * If you want to use services like sentry or keen.io so here ist the best place.
 *
 * No application/api specific settings are done here. So as example no DB conncetion is done here.
 * All application/api specific settings must be done by their modules and should be provided by
 * the context like; app.context.db = db();
 *
 * @author    Jan Nahody {@link http://nahody.github.io}
 * @copyright Copyright (c) 2017, Jan Nahody <jan.nahody@gmail.com>
 * @license   Apache-2.0
 */

const Koa = require("koa");
const middleware = require("./middleware");
const routes = require("./routes");

module.exports = function web(config, app) {
    let web = new Koa();
    web.context.config = config;
    web.keys = config.keys;

    /*
     * Setup middleware
     */
    web.use(middleware(config, app));

    /*
     * Routes
     * To enable custom routes, define some
     * and import as shown at line below.
     */
    web.use(routes(config, app));

    return web;
}
