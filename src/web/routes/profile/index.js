/**
* Profile Routes
*
* @author    Jan Nahody {@link http://nahody.github.io}
* @copyright Copyright (c) 2017, Jan Nahody
* @license   Apache-2.0
*/
module.exports = ( router, config, app ) => {
   router
       .get( "/", (ctx, next) => {
           ctx.body = 'profile route';
       });
};
