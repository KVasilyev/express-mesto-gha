const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Жак-Ив',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Unknowcvcvc.jpg',
  },
})

module.exports = mongoose.model('user', userScheme);
