const jwt = require('jsonwebtoken');
const router = require('express').Router();

const User = require('../models/user');
const Session = require('../models/session');
const bcrypt = require('bcrypt');
const { SECRET } = require('../util/config');

router.post('/', async (req, res) => {
  const body = req.body;
  const user = await User.findOne({
    where: {
      username: body.username
    }
  });

  if (user.disabled) {
    return res
      .status(401)
      .json({ error: 'This user is banned, contact the admin.' });
  }

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

  try {
    await Session.create({
      token,
      user_id: user.id
    });
    console.log('Token added to session successfully');
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: 'An error occured while trying to sign in' });
  }

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;
