const router = require('express').Router();
const { Blog } = require('../models');
const { sequelize } = require('../util/db');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('sum', sequelize.col('likes')), 'likes'],
      [sequelize.fn('count', sequelize.col('id')), 'blogs']
    ],
    group: 'author',
    order: sequelize.literal('likes DESC')
  });

  return res.json(blogs);
});

module.exports = router;
