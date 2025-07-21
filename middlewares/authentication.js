const { validateToken } = require("../utils/authentication");

function checkoutForAuthentication(req, res, next) {
    const token = req.cookies.token;
    console.log("Token received:", token);
    if (!token) {
        return res.redirect('/login');
        // return res.status(401).json({ message: 'Unauthorized' });
    }
    const userData = validateToken(token);
    if (!userData) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = userData;
    console.log("User authenticated:", req.user);
    next();
}

module.exports = {
    checkoutForAuthentication
};