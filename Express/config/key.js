if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod'); // prod.js
} else {
    module.exports = require('./dev'); // dev.js
}