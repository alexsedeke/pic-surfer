/**
 * Account Routes
 *
 * @author    Jan Nahody {@link http://nahody.github.io}
 * @copyright Copyright (c) 2017, Jan Nahody
 * @license   Apache-2.0
 */
const passport = require( "koa-passport" );
module.exports = ( router, config, app ) => {
    router.get( "/", ( ctx, next ) => {
        ctx.body = 'Account route';
    } )
    .post( "/login", passport.authenticate( 'local', {
        successRedirect: '/profile',
        failureRedirect: '/',
        session: false
    } ) )
    .post( "/create", async(ctx, next) => {
        if (ctx.request.body.user && ctx.request.body.password) {
            try {
                let newAccount = new app.account();
                newAccount.email = ctx.request.body.user;
                newAccount.password = ctx.request.body.password;
                newAccount.username = ctx.request.body.user;
                await newAccount.save();
                ctx.body = "was saved";
                next();
            } catch(e) {
                console.log(e.message);
                ctx.body = "mist";
                next();
            }
        } else {
            ctx.body = "missing";
            next();
        }
    });
};
