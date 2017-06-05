/**
 * Dynamic Routes loading.
 * Currently is not use cause webpack can't automaticaly merge them together.
 * For webpack a fileLoader is required and have to be written later.
 *
 * @author    Jan Nahody {@link http://nahody.github.io}
 * @copyright Copyright (c) 2017, Jan Nahody
 * @license   Apache-2.0
 */
const compose = require("koa-compose");
const Router = require("koa-router");
const importDir = require("import-dir");
const path = require("path");

const routerConfigs = [{
    folder: "base",
    prefix: ""
}, {
    folder: "account",
    prefix: "/account"
}, {
    folder: "profile",
    prefix: "/profile"
}];

module.exports = function routes(config, app) {
    const composed = routerConfigs.reduce((prev, curr) => {
        const routeFiles = importDir( path.join(__dirname, curr.folder) );
        const router = new Router({
            prefix: curr.prefix
        });

        Object.keys(routeFiles).map(name => routeFiles[name](router, config, app));

        return [router.routes(), router.allowedMethods(), ...prev];
    }, []);

    return compose(composed);
}
