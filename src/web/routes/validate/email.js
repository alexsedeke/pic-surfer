/**
 * Email Validation
 * Login is not required
 *
 * @author    Jan Nahody {@link http://nahody.github.io}
 * @copyright Copyright (c) 2017, Jan Nahody
 * @license   Apache-2.0
 */
const validator = require('validator');

module.exports = ( router, config, app ) => {
   router
       .post( "/email", (ctx, next) => {
           try {
               if (!validator.isEmail(ctx.request.body.email)) {
                   ctx.body = {message: 'Wrong email format', type: 'error', valid: false};
               } else {
                   ctx.body = {type: 'success', valid: true};
               }
               next();
        } catch(e) {
            throw new Error('Parameter email is required and must be string!');
        }
       });
};
