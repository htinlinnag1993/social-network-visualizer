// keys.js - figure out what set of credentials to return

if (process.env.NODE_ENV === 'production') {
    // we are in production - return the prod keys
    module.exports = require('./prod-keys');
} else {
    // we are in development - return the dev keys
    module.exports = require('./dev-keys');
}