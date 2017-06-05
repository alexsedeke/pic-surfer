/**
 * Compose Middleware
 * for CORS and bodyParser
 *
 * @author    Jan Nahody {@link http://nahody.github.io}
 * @copyright Copyright (c) 2017, Jan Nahody <jan.nahody@gmail.com>
 * @license   Apache-2.0
 */
const passport = require( 'koa-passport' );
const LocalStrategy = require( 'passport-local' ).Strategy;


function initPassport(app) {
    passport.use( new LocalStrategy( function ( userident, password, done ) {

        // if (!username || !password) {
        //     return done( null, false, {
        //                 message: 'Username and password are required.'
        //             } );
        // }
        //
        // if (username === "test" && password === "test") {
        //     return done(null, 'jwt');
        // } else {
        //     done( null, false, {
        //                 message: 'Incorrect username or password.'
        //             } );
        // }
        app.account.findOne( {
            email: userident
        }, function ( err, account ) {
            if( err ) {
                return done( err );
            }
            if( !account ) {
                return done( null, false, {
                    message: 'Incorrect username.'
                } );
            }
            if( !account.validPassword( password ) ) {
                return done( null, false, {
                    message: 'Incorrect password.'
                } );
            }
            return done( null, user );
        } );
    } ) );

    return passport;
}

module.exports = initPassport;
