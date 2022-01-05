const { Blog, User, Session } = require('../models');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');

const blogFinder = async (req, _res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const decodedToken = jwt.verify(authorization.substring(7), SECRET);
      let tokenInDB;
      try {
        tokenInDB = await Session.findOne({
          where: {
            token: authorization.substring(7)
          }
        });
      } catch (error) {
        return res.status(401).json({ error: 'token is not a valid one' });
      }
      if (tokenInDB !== null) {
        req.decodedToken = decodedToken;
      } else {
        return res.status(401).json({ error: 'token is not a valid one!' });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }

  next();
};

const checkUserStatus = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (user.disabled) {
    req.decodedToken = '';
    return res.status(401).json({ error: 'User is banned' });
  }

  next();
};

module.exports = { blogFinder, tokenExtractor, checkUserStatus };
