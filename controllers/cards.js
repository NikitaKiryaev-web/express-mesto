const Card = require('../models/card');

//Получить все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send(err));
};

//Создать карточку
const createCard = (req, res) => {
  const {name, link} = req.body;
  const owner = req.user._id;
  Card.create({name, link, owner})
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(500).send(err));
};

//Удалить карточку
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((res) => res.status(200).send(res))
    .catch((err) => res.status(500).send(err));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true})
    .then((res) => res.status(200).send(res))
    .catch((err) => res.status(500).send(err))
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
  {$pull: {likes: req.user._id}},
  {new: true})
  .then((res) => res.status(200).send('Лайк убран'))
  .catch((err) => res.status(500).send(err))
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}