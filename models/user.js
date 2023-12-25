const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: {
      value: true,
      message: 'Обязательное поле',
    },
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: {
      value: true,
      message: 'Обязательное поле',
    },
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: {
      value: true,
      message: 'Обязательное поле',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userScheme);
