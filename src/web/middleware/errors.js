
function serverError(app) {
    return async function (ctx, next) {
        try {
            await next();
        } catch (err) {
            err.status = err.status || 500;

            ctx.status = err.status;
            ctx.body = {type: 'error', code: err.status, message: err.message};

            // Since we handled this manually we'll
            // want to delegate to the regular app
            // level error handling as well so that
            // centralized still functions correctly.
            // ACTUALY this do not propper work :(
            // app.emit('error', err, this);
        }
    };
}

module.exports.serverError = serverError;
