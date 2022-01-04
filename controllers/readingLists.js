const router = require('express').Router();
const { ReadingList } = require('../models');
const { tokenExtractor } = require('../util/middleware');

router.get('/', async (_req, res) => {
  try {
    const readingLists = await ReadingList.findAll();
    return res.json(readingLists);
  } catch (error) {
    console.log('ERROR:', error.message);
    return res.status(500).send({ error: 'An error occured' });
  }
});

router.put('/:id', tokenExtractor, async (req, res) => {
  const blogFromList = await ReadingList.findByPk(req.params.id);
  if (!blogFromList)
    return res.status(500).send({ error: 'Book doesnt exist in reading list' });
  if (blogFromList.userId === req.decodedToken.id) {
    try {
      blogFromList.isRead = req.body.isRead;
      await blogFromList.save();
      return res.status(200).send({
        success: 'Book updated successfully'
      });
    } catch (error) {
      console.log('ERROR:', error.message);
      return res
        .status(500)
        .send({ error: 'An error occured while trying to save the book' });
    }
  } else {
    return res
      .status(500)
      .send({ error: 'You dont have the access to change this book list' });
  }
});

module.exports = router;
