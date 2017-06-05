/**
 * Account Routes
 *
 * @author    Jan Nahody {@link http://nahody.github.io}
 * @copyright Copyright (c) 2017, Jan Nahody
 * @license   Apache-2.0
 */
const passport = require( "koa-passport" );
const jwt = require('jsonwebtoken');

module.exports = ( router, config, app ) => {
    router.get( "/", ( ctx, next ) => {
        ctx.body = 'Account route';
    } )
    .post( '/auth', function ( ctx, next ) {
        return passport.authenticate( 'local', function ( err, account, info, status ) {
             if (err) {
                 return next(err);
             }
             if (!account) {
                 return ctx.redirect('/');
             } else {
                 let token = jwt.sign({ id: account._id, email: account.email, name: account.username }, app.settings.jwt.secret);
                 return ctx.body = token;
             }
        } )( ctx, next );
    } )
    /*
     * create route is still a draft
     */
    .post( "/create", async(ctx, next) => {
        if (ctx.request.body.usermail && ctx.request.body.password && ctx.request.body.username) {
            try {
                let newAccount = new app.account();
                newAccount.email = ctx.request.body.usermail;
                newAccount.password = ctx.request.body.password;
                newAccount.username = ctx.request.body.username;
                await newAccount.save();
                ctx.body = "was saved";
                next();
            } catch(e) {
                ctx.body = "mist";
                next();
            }
        } else {
            ctx.body = "missing";
            next();
        }
    });
};
