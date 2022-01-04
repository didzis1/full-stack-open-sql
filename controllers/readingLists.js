const router = require('express').Router();

const { ReadingList } = require('../models');

router.get('/', async (_req, res) => {
  try {
    const readingLists = await ReadingList.findAll();
    return res.json(readingLists);
  } catch (error) {
    console.log('ERROR:', error.message);
    return res.status(500).send({ error: 'An error occured' });
  }
});

module.exports = router;
