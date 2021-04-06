const router = require('express').Router();
const {
  getUsers, getProfile, updateProfile, updateAvatar, getMyUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getProfile);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);
router.get('/users/me', getMyUser);

module.exports = router;
