const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Авторизаційний токен відсутній' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer TOKEN" => беремо TOKEN

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // додаємо info про користувача у req
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Невалідний токен' });
  }
}

module.exports = authMiddleware;
