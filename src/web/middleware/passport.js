/**
 * Compose passport auth strategies for middleware
 *
 * @author    Jan Nahody {@link http://nahody.github.io}
 * @copyright Copyright (c) 2017, Jan Nahody <jan.nahody@gmail.com>
 * @license   Apache-2.0
 */
const passport = require( 'koa-passport' );
const LocalStrategy = require( 'passport-local' ).Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


function initPassport(app) {
    /* Local Credentials Passport Strategy */
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

    /* JWT Passport Strategy */
    let JWToptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey: app.settings.jwt.secret
    }

    passport.use(new JwtStrategy(JWToptions, function(jwt_payload, done) {
        app.account.findById(jwt_payload.id, function(err, account) {
            if (err) {
                return done(err, false);
            }
            if (account) {
                return done(null, account);
            } else {
                return done(null, false);
            }
        });
    } ) );

    return passport;
}

module.exports = initPassport;
