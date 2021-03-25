const User = require('../models/user');

//Получить всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send(err));
}

//Получить данные своего профиля
const getProfile = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send(err));
}

//Создать пользователя
const createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send(err));
};

//Обновить данные пользователя
const updateProfile = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, {
    new: true //в then попадет обновленная запись
  })
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
};

//Обновить аватар пользователя
const updateAvatar = (req, res) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, {
    new: true
  })
  .then((data) => res.status(200).send(data))
  .catch((err) => res.status(500).send(err));
};



module.exports = {
  getUsers,
  getProfile,
  createUser,
  updateAvatar,
  updateProfile
};