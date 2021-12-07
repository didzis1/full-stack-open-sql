require('dotenv').config();

const express = require('express');
const app = express();
const { Sequelize, Model, DataTypes } = require('sequelize');

app.use(express.json());

const PORT = process.env.PORT || 3001;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    author: {
      type: DataTypes.TEXT
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
  }
);

app.get('/', async (_req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

app.post('/api/blogs', async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    return res.json(newBlog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  // If blog exists, delete it
  if (blog) {
    await blog.destroy();
  }

  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
