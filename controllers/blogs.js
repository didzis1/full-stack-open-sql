const router = require('express').Router();
const { Blog } = require('../models');
const { blogFinder } = require('../util/middleware');

router.get('/', async (_req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post('/', async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    return res.json(newBlog);
  } catch (error) {
    console.log(error.name);
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
