const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AuthError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
  // верифицируем токен
    payload = jwt.verify(token, "41452244c0ff5e928b37b9ced5a7670f52fe8b5a7aa431eb88a0ed06ad321295");
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }


  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};

module.exports = auth;
