const express = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.render('blog');
});

router.post('/', upload.single('image'), async (req, res) => {
    const { title, body } = req.body;
    const image = req.file.filename;
    const blog = await Blog.create({ title, body, image: `./uploads/${image}`, createdAt: req.user._id });
    res.redirect('/');
});

module.exports = router;