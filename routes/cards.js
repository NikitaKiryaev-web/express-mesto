const router = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const {validateCardId, validateCard} = require('../middlewares/validation');

router.get('/cards', getCards);
router.post('/cards', validateCard, createCard); // вторым аргументом передаем middleware для валидации приходящих данных до обращения к бд
router.delete('/cards/:cardId', validateCardId, deleteCard);
router.put('/cards/:cardId/likes', validateCardId, likeCard);
router.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
