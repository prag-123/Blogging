const jwt = require('jsonwebtoken');

const secret = '$itsMysceret#';

function generateToken(user) {
    const Payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(Payload, secret, { expiresIn: '1h' });
}

function validateToken(token) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

module.exports = {
    generateToken,
    validateToken
}