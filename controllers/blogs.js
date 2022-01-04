const router = require('express').Router();
const { Blog, User } = require('../models');
const { blogFinder, tokenExtractor } = require('../util/middleware');
const { Op, Sequelize } = require('sequelize');

router.get('/', async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          author: {
            [Op.match]: Sequelize.fn('to_tsquery', req.query.search)
          }
        },
        {
          title: {
            [Op.match]: Sequelize.fn('to_tsquery', req.query.search)
          }
        }
      ]
    };
  }

  const blogs = await Blog.findAll({
    attributes: {
      exclude: ['userId']
    },
    include: {
      model: User,
      attributes: ['username']
    },
    where,
    order: [['likes', 'DESC']]
  });
  res.json(blogs);
});

router.post('/', tokenExtractor, async (req, res) => {
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

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const blog = req.blog;
  if (blog) {
    if (blog.userId === req.decodedToken.id) {
      await blog.destroy();
    }
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
