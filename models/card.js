const mongoose = require('mongoose');

const cardScheme = new mongoose.Schema({
  name: {
    type: String,
    required: {
      value: true,
      message: 'Обязательное поле',
    },
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: {
      value: true,
      message: 'Обязательное поле',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: {
      value: true,
      message: 'Обязательное поле',
    },
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardScheme);
