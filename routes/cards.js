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
router.put('/:cardId/likes', putLikeToCard);
router.delete('/:cardId/likes', removeLikeFromCard)


module.exports = router;