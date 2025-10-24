// middlewares/auth.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  //console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    return res.status(403).send({ message: 'No token provided.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(403).send({ message: 'Malformed token.' });
  }

  const token = parts[1];
  //console.log("Token:", token);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;