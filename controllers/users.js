const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

// Все пользователи
module.exports.getUsersList = (req, res, next) => {
  User.find({}, {
    _id: 1, name: 1, about: 1, avatar: 1,
  })
    .then((user) => {
      res.status(200).send({
        user,
      });
    })
    .catch((err) => {
      next(err);
    });
};

// Пользователь по ID
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId, {
    _id: 1, name: 1, about: 1, avatar: 1,
  })
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Пользователь c таким ID не найден');
      }
      res.status(200).send({
        data: user,
      });
    })
    .catch((err) => next(err));
};

// Создаем пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => {
        res.status(200).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Этот e-mail уже зарегистрирован'));
        } else if (err.name === 'ValidationError') {
          next(new BadRequestError('Некорректные данные'));
          return;
        }
        next(err);
      }));
};

// Обновление профиля
module.exports.updateUser = (req, res, next) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(200).send({
        user,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

// Обновление аватара
module.exports.updateUserAvatar = (req, res, next) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true, select: { avatar } })
    .orFail()
    .then((user) => {
      res.status(200).send({
        user,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

// Авторизация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователь c таким ID не найден');
      } else {
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (matched) {
              const token = jwt.sign(
                { _id: user._id },
                'some-secret-key', // Ключ
                { expiresIn: '7d' },
              );
              res.status(200).send({
                token,
              });
            } else {
              res.status(500).send({
                message: 'Не верный пароль',
              });
            }
          });
      }
    })
    .catch((err) => next(err));
};

// Текущий пользователь
module.exports.currentUser = (res, req, next) => {
  const id = req.user._id;
  User.findById(id).select('-password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send({
        user,
      });
    })
    .catch(next);
};
