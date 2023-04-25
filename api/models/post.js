const { Sequelize, DataTypes } = require('sequelize');
const db = require('../middlewares/db');
const bcrypt = require('bcryptjs');

const User = require('./user');

const Post = db.define(
  'Post',
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      allowNull: false,
      defaultValue: 'draft',
    },
  },
  {
    tableName: 'posts',
    timestamps: true,
  },
);

Post.belongsTo(User, { foreignKey: 'id' });
User.hasMany(Post, { foreignKey: 'id' });

module.exports = Post;
