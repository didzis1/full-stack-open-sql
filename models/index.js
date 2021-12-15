const Blog = require('./blog');
const User = require('./user');

Blog.sync({ alter: true });
User.sync({ alter: true });

module.exports = { Blog, User };
