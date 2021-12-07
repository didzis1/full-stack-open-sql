require('dotenv').config();

const express = require('express');
const app = express();
const { Sequelize, Model, DataTypes } = require('sequelize');

app.use(express.json());

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

const main = async () => {
  try {
    await sequelize.authenticate();
    const blogs = await Blog.findAll();
    blogs.map((blog) => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    });
    sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the DB', error);
  }
};

main();
