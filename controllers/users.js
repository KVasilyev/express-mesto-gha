const User = require('../models/user');

// Все пользователи
module.exports.getUsersList = (req, res) => {
  User.find({}, { _id: 1, name: 1, about: 1, avatar: 1 })
  .then((user) => {
    res.status(200).send({
      data: user,
    })
  })
  .catch((err) => {
    res.status(500).send({
      message: `Произошла ошибка при получении списка пользователей. Подробнее: ${err.message}`,
    })
  })
}

// Пользователь по ID
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId, { _id: 1, name: 1, about: 1, avatar: 1 })
  .orFail()
  .then((user) => {
    res.status(200).send({
      data: user
    })
  })
  .catch((err) => {
    if (err.message === 'DocumentNotFoundError') {
      res.status(400).send({
        message: `Передан некорректный ID`,
      })
      return;
    } else if (err.message === 'CastError') {
      res.status(404).send({
        message: `Пользователь с таким ID не найден`,
      })
      return;
    } else {
      res.status(500).send({
        message: `Произошла ошибка. Подробнее: ${err.message}`,
      })
      return;
    }
  })
}

// Создаем пользователя
module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar})
  .then((user) => {
    res.status(200).send({
      data: user
    })
  })
  .catch((err) => {
    if(err.name === "ValidationError") {
      res.status(400).send({
        message: `Невалидные данные при создании пользователя`,
      })
    } else {
      res.status(500).send({
        message: `Произошла ошибка. Подробнее: ${err.message}`,
      })
    }
  })
}

// Обновление профиля
module.exports.updateUser = (req, res) => {
  const owner = req.userId;
  const { name, about } = req.body;
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
  .orFail()
  .then((user) => {
    res.status(200).send({
      data: user,
    })
  })
  .catch((err) => {
    if(err.name === 'ValidationError') {
      res.status(400).send({
        message: `Невалидные данные при обновлении пользователя`,
      })
    } else if(err.name === 'CastError') {
      res.status(404).send({
        message: `Пользователь с таким ID не найден`,
      })
    } else {
      res.status(500).send({
        message: `Произошла ошибка. Подробнее: ${err.message}`,
      })
    }
  })
}

// Обновление аватара
module.exports.updateUserAvatar = (req, res) => {
  const owner = req.userId;
  const { avatar } = req.body;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true, select: { avatar } })
  .orFail()
  .then((user) => {
    res.status(200).send({
      data: user,
    })
  })
  .catch((err) => {
    if(err.name === 'ValidationError') {
      res.status(400).send({
        message: `Невалидные данные при обновлении аватара пользователя`,
      })
    } else if (err.name === 'CastError') {
      res.status(404).send({
        message: `Пользователь с таким ID не найден`,
      })
    } else {
      res.status(500).send({
        message: `Произошла ошибка. Подробнее: ${err.message}`,
      })
    }
  })

}