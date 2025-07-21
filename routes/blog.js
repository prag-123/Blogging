const express = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

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

//route to view a single blog
router.get('/:id', async (req, res) => {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
        return res.status(404).send('Blog not found');
    }
    const comments = await Comment.find({ blogId }).populate('userId');
    console.log(comments);
    res.render('viewBlog', { blog, comments: comments || [] });
});


//route to create a new blog
router.post('/', upload.single('image'), async (req, res) => {
    const { title, body } = req.body;
    const image = req.file.filename;
    const blog = await Blog.create({ title, body, image: `/uploads/${image}`, createdBy: req.user._id });
    res.redirect('/');
});

//route to add comment`
router.post('/:id/comment', async (req, res) => {
    const blogId = req.params.id;
    const userId = req.user.id;
    const content = req.body.content;
    const blog = await Blog.findById(blogId);
    if (!blog) {
        return res.redirect(`home`); // Redirect to home if blog not found);
    }
    const newComment = await Comment.create({ content, blogId, userId });
    
    res.redirect(`/blog/${blogId}`);
});

module.exports = router;