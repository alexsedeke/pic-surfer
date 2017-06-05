/**
 * Compose passport auth strategies for middleware
 *
 * @author    Jan Nahody {@link http://nahody.github.io}
 * @copyright Copyright (c) 2017, Jan Nahody <jan.nahody@gmail.com>
 * @license   Apache-2.0
 */
const passport = require( 'koa-passport' );
const LocalStrategy = require( 'passport-local' ).Strategy;


function initPassport(app) {
    passport.use( new LocalStrategy( function ( username, password, done ) {
        app.account.findOne( {
            email: username
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
            return done( null, account );
        } );

    } ) );

    return passport;
}

module.exports = initPassport;
