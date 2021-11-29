'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Book.belongsTo(models.Author, {
        foreignKey: {
          type: DataTypes.UUID,
          name: 'authorId',
          field: 'author_id',
          allowNull: false
        }
      });
      Book.belongsTo(models.Genre, {
        foreignKey: {
          type: DataTypes.UUID,
          name: 'genreId',
          field: 'genre_id',
          allowNull: false
        }
      });
      Book.belongsTo(models.User, {
        foreignKey: {
          type: DataTypes.UUID,
          name: 'userId',
          field: 'user_id',
          allowNull: false
        }
      })
      // define association here
    }
  }
  Book.init({
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
    modelName: 'Book',
    tableName: 'books',
    timestamps: true,
    paranoid: true,
    underscored: true
  });
  return Book;
};