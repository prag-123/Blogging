require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./routes/user');
const jwt = require('jsonwebtoken');
const { checkoutForAuthentication } = require('./middlewares/authentication');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const Blog = require('./models/blog');


const app = express();
const port = process.env.PORT || 60001;

app.use(cookieParser());

//database connection
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('./public')));

app.get('/', async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
  res.render('home', {
    blogs: allBlogs
  });
});

app.use('/', routes);
app.use('/blog', checkoutForAuthentication, require('./routes/blog'));


app.set('view engine', 'ejs');
app.set('views', path.resolve('views'));


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});