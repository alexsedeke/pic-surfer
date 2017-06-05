/**
* Profile Routes
*
* @author    Jan Nahody {@link http://nahody.github.io}
* @copyright Copyright (c) 2017, Jan Nahody
* @license   Apache-2.0
*/
const passport = require( "koa-passport" );

module.exports = ( router, config, app ) => {
   router
       .get( "/", passport.authenticate('jwt', { session: false }), (ctx, next) => {
           ctx.body = 'profile route';
       });
};
