const router = require('express').Router();
const { Blog, User } = require('../models');
const { blogFinder } = require('../util/middleware');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }

  next();
};

router.get('/', async (_req, res) => {
  const blogs = await Blog.findAll({
    attributes: {
      exclude: ['userId']
    },
    include: {
      model: User,
      attributes: ['username']
    }
  });
  res.json(blogs);
});

router.post('/', tokenExtractor, async (req, res) => {
  console.log('DECODED TOKEN', req.decodedToken);
  try {
    const user = await User.findOne({
      where: {
        id: req.decodedToken.id
      }
    });
    const newBlog = await Blog.create({ ...req.body, userId: user.id });
    return res.json(newBlog);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      error: 'An error occured while trying to save a new blog'
    });
  }
});

router.delete('/:id', blogFinder, async (req, res) => {
  // If blog exists, delete it
  if (req.blog) {
    await req.blog.destroy();
  }

  res.status(204).end();
});

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    try {
      req.blog.likes = req.body.likes;
      await req.blog.save();
      res.json(req.blog);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: 'An error occured while trying to update the likes'
      });
    }
  } else {
    res.status(404).send({ error: 'Blog does not exist.' });
  }
});

module.exports = router;
