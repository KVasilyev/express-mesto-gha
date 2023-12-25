const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const pageNotFound = require('./routes/page-not-found')

const app = express();

mongoose.connect(MONGO_URL);

app.use((req, res, next) => {
  req.user = {
    _id: '6588432a36b7a137f439ffb6'
  };
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/users', userRouter)
app.use('/cards', cardRouter)
app.use('*', pageNotFound)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})