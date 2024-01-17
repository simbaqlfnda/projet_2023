const jwt = require('jsonwebtoken');
const { currentUser } = require('../models/users');

const jwtSecret = 'soislechangementquetuveuxvoirdanslemonde';

const authorize = async (req, res, next) => {
  const token = req.get('authorization');
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const { userName } = decoded;

    const existingUser = await currentUser(userName);

    if (!existingUser) return res.sendStatus(401);

    req.user = existingUser; // request.user object is available in all other middleware functions
    return next();
  } catch (err) {
    return res.sendStatus(401);
  }
};

const isAdmin = (req, res, next) => {
  const { userName } = req.user;

  if (userName !== 'admin') return res.sendStatus(403);
  return next();
};

module.exports = { authorize, isAdmin };
