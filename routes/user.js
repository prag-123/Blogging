const express = require('express');
const User = require('../models/user');
const { generateHmacSignature } = require('../utils/crypto');
const { generateToken } = require('../utils/authentication');
const { checkoutForAuthentication } = require('../middlewares/authentication');
const jwt = require('jsonwebtoken');



const router = express.Router();
const blog = require('../models/blog');

router.get('/signup', function (req, res) {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/', checkoutForAuthentication, (req, res) => {
    console.log(req.cookies);
    console.log(req.user);
    res.render('home', { user: req.user });
});

router.post('/signup', async function handleSignUp(req, res) {

    const { fullname, email, password } = req.body;

    await User.create({ fullname, email, password });

    res.redirect('/');
});

router.post('/login', async function (req, res) {

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.render('signup', { error: 'User not found' });
    }
    const salt = user.salt;
    const inputPasswordHash = generateHmacSignature(password, salt);

    if (user.password !== inputPasswordHash) {
        return res.render('login', { error: 'Invalid password' });
    } else {
        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router;