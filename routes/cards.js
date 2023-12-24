const router = require('express').Router();

const {
  getCardsList,
  addCard,
  deleteCard,
  putLikeToCard,
  removeLikeFromCard
} = require('../controllers/cards');

router.get('/', getCardsList);
router.post('/', addCard);
router.delete('/:cardId', deleteCard);
router.patch('/:cardId/likes', putLikeToCard);
router.patch('/:cardId/likes', removeLikeFromCard)


module.exports = router;