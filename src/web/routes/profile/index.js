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
       .use(passport.authenticate('jwt', { session: false }))
       .get( "/", (ctx, next) => {
           ctx.body = 'profile route';
       });
};
