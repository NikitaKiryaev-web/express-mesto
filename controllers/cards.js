const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

//  Получить все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

//  Создать карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      throw new ValidationError('Данные неверны');
    })
    .catch(next);
};

//  Удалить карточку
const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findById(req.params.cardId)
    .orFail(new Error('Нет такой карточки'))
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку');
      }

      Card.findByIdAndDelete(req.params.cardId)
        .then((data) => res.status(200).send('Карточка удалена'))
        .catch(next);
    })
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    })
    .orFail(new Error('Нет карточки с таким id'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Id неверный');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    })
    .orFail(new Error('Нет карточки с таким id'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Id неверный');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
