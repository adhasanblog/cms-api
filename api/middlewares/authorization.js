const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ error: 'Invalid token' });

  const token = authorization.split(' ')[1];
  const verifyToken = jwt.verify(token, 'cmsijp');
  const userId = verifyToken.userId;

  const user = await User.findByPk(userId);

  req.user = user;

  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  next();
};

module.exports = auth;
