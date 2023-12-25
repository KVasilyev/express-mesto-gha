const Card = require('../models/card');

// Все карточки
module.exports.getCardsList = (req, res) => {
  Card.find({})
    .then((card) => {
      res.status(200).send({
        data: card,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: `Произошла ошибка при получении списка карточек. Подробнее: ${err.message}`,
      });
    });
};

// Добавляем карточку
module.exports.addCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({
        data: card,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Невалидные данные при создании карточки',
        });
      } else {
        res.status(500).send({
          message: `Произошла ошибка. Подробнее: ${err.message}`,
        });
      }
    });
};

// Удаляем карточку
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete({ _id: req.params.cardId })
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Некорректный ID для удаления карточки',
        });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({
          message: 'Карточка с таким ID не найдена',
        });
      } else {
        res.status(500).send({
          message: `Произошла ошибка. Подробнее: ${err.message}`,
        });
      }
    });
};

// Ставим лайк
module.exports.putLikeToCard = (req, res) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      res.status(200).send({
        data: card,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Передан некорректный ID карточки',
        });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({
          message: 'Карточка с таким ID не найдена',
        });
      } else {
        res.status(500).send({
          message: `Произошла ошибка. Подробнее: ${err.message}`,
        });
      }
    });
};

// Убираем лайк
module.exports.removeLikeFromCard = (req, res) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      res.status(200).send({
        data: card,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Передан некорректный ID карточки',
        });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({
          message: 'Карточка с таким ID не найдена',
        });
      } else {
        res.status(500).send({
          message: `Произошла ошибка. Подробнее: ${err.message}`,
        });
      }
    });
};
