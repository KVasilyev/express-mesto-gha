const mongoose = require('mongoose');
const validator = require('validator');

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (avatar) => {
        /https?:\/\/(www\.)?[a-zA-Z0-9-@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([a-zA-Z0-9()-@:%_+.~#?&//=]*)/.test(avatar);
      },
      message: 'Неправильный формат URL',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Неправильный формат e-mail',
    },
    unique: true, // Уникальный e-mail
  },
  password: {
    type: String,
    required: {
      value: true,
      message: 'Обязательное поле',
    },
    select: false, // Не отправлять пароль в запросе
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userScheme);
