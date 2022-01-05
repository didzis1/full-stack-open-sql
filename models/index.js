const Blog = require('./blog');
const User = require('./user');
const ReadingList = require('./readingList');
const Session = require('./session');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: 'readListBlogs' });
Blog.belongsToMany(User, { through: ReadingList, as: 'readListUsers' });

User.hasMany(Session);
Session.belongsTo(User);

// Syncing is done by migrations now
// Blog.sync({ alter: true });
// User.sync({ alter: true });

module.exports = { Blog, User, ReadingList, Session };
