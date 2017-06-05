/**
 * Configuration
 *
 * @author    Jan Nahody {@link http://nahody.github.io}
 * @copyright Copyright (c) 2017, Jan Nahody
 * @license   Apache-2.0
 */
const nodenvconf = require("nodenvconf");
const path  = require("path");
const ld  = require("lodash");

class ConfigOptions{
    constructor(options) {
        if (!ConfigOptions.instance) {
            this._nodenvconf = new nodenvconf(options).dispatch();
            ConfigOptions.instance = this;
        }

        return ConfigOptions.instance;
    }

    getDomain(domain, path) {
        let result = "";

        if (domain) {
            result = this._nodenvconf[domain];
        }

        if ((ld.isString(path) || ld.isArray(path)) && ld.has(result, path)) {
            result = ld.get(result, path);
        }

        return result;
    }

    all() {
        return this._nodenvconf;
    }
}

const ConfigOptionsInstance = new ConfigOptions({
    configDir: path.join(__dirname, '../config'),
    prefix: "psurfer"
});

Object.freeze(ConfigOptionsInstance);

module.exports =  ConfigOptionsInstance;
