const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./routes/user');

const app = express();
const port = 60001;


//database connection
mongoose.connect('mongodb://localhost:27017/blogging').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

app.set('view engine', 'ejs');
app.set('views', path.resolve('views'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

