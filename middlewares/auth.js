const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next(new UnauthorizedError('Требуется авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, '830e7e9b-8a50-467a');
  } catch (err) {
    next(new UnauthorizedError('Требуется авторизация'));
    return;
  }
  req.user = payload;
  next();
};
