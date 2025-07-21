const { validateToken } = require("../utils/authentication");

function checkoutForAuthentication(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
        // return res.status(401).json({ message: 'Unauthorized' });
    }
    const userData = validateToken(token);
    if (!userData) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = userData;
    next();
}

module.exports = {
    checkoutForAuthentication
};