const router = require('express').Router();

const {
  getUsers, getProfile, updateProfile, updateAvatar, getMyUser,
} = require('../controllers/users');

const {validateId, validateUserInfo, validateUserAvatar} = require('../middlewares/validation');

router.get('/users', getUsers);
router.get('/users/me', getMyUser);
router.get('/users/:id', validateId, getProfile); // вторым аргументом передаем middleware для валидации приходящих данных до обращения к бд
router.patch('/users/me', validateUserInfo, updateProfile);
router.patch('/users/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
