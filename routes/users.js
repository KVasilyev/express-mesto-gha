const router = require('express').Router();

const {
  getUsersList,
  getUserById,
  addUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsersList);
router.get('/:userId', getUserById);
router.post('/', addUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
