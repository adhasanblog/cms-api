const { Sequelize, DataTypes } = require('sequelize');
const db = require('../middlewares/db');

const User = require('./user');

const MediaLibrary = db.define(
  'MediaLibrary',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    alt_text: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.TEXT,
    },
    title: {
      type: DataTypes.STRING(255),
    },
    mime_type: {
      type: Sequelize.STRING(255),
    },
    media_details: {
      type: Sequelize.TEXT,
    },
  },
  {
    tableName: 'media_library',
    timestamps: true,
  },
);

MediaLibrary.belongsTo(User, { foreignKey: 'id' });
User.hasMany(MediaLibrary, { foreignKey: 'id' });

module.exports = MediaLibrary;
