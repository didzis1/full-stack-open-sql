const Blog = require('./blog');
const User = require('./user');
const ReadingList = require('./readingList');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: 'readListBlogs' });
Blog.belongsToMany(User, { through: ReadingList, as: 'readListUsers' });

// Syncing is done by migrations now
// Blog.sync({ alter: true });
// User.sync({ alter: true });

module.exports = { Blog, User, ReadingList };
