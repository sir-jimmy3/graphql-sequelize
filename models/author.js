'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Author.hasMany(models.book, {
        foreignKey: {
          name: 'authorId',
          field: 'author_id'
        }
      })
      // define association here
    }
  }

  Author.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'author',
    tableName: 'authors',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  return Author;
};