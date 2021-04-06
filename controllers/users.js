const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthError = require('../errors/AuthError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const DuplicateError = require('../errors/DuplicateError');

// Получить всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

// Получить данные о текущем пользователе
const getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('Нет пользователя с таким id'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Id неверный');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

// Получить данные профиля по id
const getProfile = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new Error('Нет пользователя с таким id'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Id неверный');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

// Создать пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new AuthError('Пароль или почта некорректны');
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(200).send(user))
        .catch((err) => {
          if (err.name === 'MongoError' || err.code === 11000) {
            throw new DuplicateError('Пользователь с таким email уже существует');
          } else if (err.name === 'ValidationError' || err.name === 'CastError') {
            throw new ValidationError('Пароль или почта некорректны');
          }
        })
        .catch(next);
    });
};

// Обновить данные пользователя
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // в then попадет обновленная запись
    runValidators: true, // валидация данных перед изменением
  })
    .orFail(new Error('Нет пользователя с таким Id'))
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Введенные данные некорректны');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

// Обновить аватар пользователя
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('Нет пользователя с таким id'))
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Введенные данные некорректны');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '41452244c0ff5e928b37b9ced5a7670f52fe8b5a7aa431eb88a0ed06ad321295', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getProfile,
  createUser,
  updateAvatar,
  updateProfile,
  login,
  getMyUser,
};
