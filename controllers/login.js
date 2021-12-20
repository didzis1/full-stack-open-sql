const jwt = require('jsonwebtoken');
const router = require('express').Router();

const User = require('../models/user');
const bcrypt = require('bcrypt');
const { SECRET } = require('../util/config');

router.post('/', async (req, res) => {
  const body = req.body;
  const user = await User.findOne({
    where: {
      username: body.username
    }
  });

  const passwordCorrect = await bcrypt.compare(
    body.password,
    user.passwordHash
  );

  if (!(user && passwordCorrect)) {
    res.status(401).json({
      error: 'Invalid username or password'
    });
  }

  const userForToken = {
    id: user.id,
    username: user.username
  };

  const token = jwt.sign(userForToken, SECRET);

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;
