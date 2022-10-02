const jwt = require('jsonwebtoken');

module.exports.generateToken = (payload) => {
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE });
}