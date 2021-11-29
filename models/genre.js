'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Genre.hasMany(models.Book, {
        foreignKey: {
          name: 'genreId',
          field: 'genre_id'
        }
      })
      // define association here
    }
  }
  Genre.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'Genre',
    tableName: 'genres',
    paranoid: true,
    timestamps: true,
    underscored: true
  });
  return Genre;
};