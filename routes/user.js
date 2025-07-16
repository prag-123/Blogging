const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/signup', function(req, res) {
    res.render('signup');
});

router.get('/login',(req, res) => {
    res.render('login');
});

router.get('/', (req, res) => {
    res.render('home');
});

router.post('/signup', async function handleSignUp(req, res) {

    const { fullname, email, password } = req.body;

    await User.create({ fullname, email, password });

    res.send('User Signup Page');
});

router.post('/login', async function(req,res){

    const {email,password} = req.body;

    const user = await User.findOne({email, password});

    if(!user){
        res.redirect('/');
    }else{
        res.send('User Login Successful');
    }
})

module.exports = router;