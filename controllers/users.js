const router = require('express').Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');

router.get('/', async (_, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        // Exclude password from return values
        exclude: ['passwordHash']
      }
    });
    res.json(users);
  } catch (error) {
    console.log('Error', error.message);
    res.status(500).send({
      error: 'An error occured while trying to fetch all users'
    });
  }
});

router.post('/', async (req, res) => {
  const { username, name, password } = req.body;
  const hashedPassword = await bcrypt.hashSync(password, 10);
  try {
    const newUser = await User.create({
      username,
      name,
      passwordHash: hashedPassword
    });
    res.json({
      username,
      name,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: 'An error occured while trying to create a user'
    });
  }
});

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    res.status(500).send({
      error: 'User not found'
    });
  }

  try {
    user.username = req.body.username;
    const updatedUser = await user.save();
    res.json({
      name: updatedUser.name,
      username: updatedUser.username,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    });
  } catch (error) {
    res.status(500).send({
      error: 'An error occured while trying to edit username'
    });
  }
});

module.exports = router;