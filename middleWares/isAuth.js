const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(token);

  if (!token) {
    return res.status(401).json('権限がありません。');
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    console.log(decoded);
    if (err) {
      return res.status(401).json('権限がありません。');
    }
    req.id = decoded.id;
    next();
  });
};

module.exports = isAuth;
