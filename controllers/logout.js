const router = require('express').Router();
const { tokenExtractor } = require('../util/middleware');
const { Session } = require('../models');

router.post('/', tokenExtractor, async (req, res) => {
  try {
    await Session.destroy({
      where: {
        userId: req.decodedToken.id
      }
    });
    return res.status(200).send({ success: 'Logged out successfully' });
  } catch (error) {
    console.log('ERROR:', error.message);
    return res
      .status(500)
      .send({ error: 'An error has occurred while trying to log out' });
  }
});

module.exports = router;
