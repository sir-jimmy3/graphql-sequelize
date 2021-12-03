'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.book, {
        foreignKey: {
          name: 'userId',
          field: 'user_id'
        }
      });
      // define association here
      this.validPassword = async function(password, hash) {
        return await bcrypt.compareSync(password, hash);
      };
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    paranoid: true,
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate(user, options) {
        return new Promise((resolve) => {
          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
          return resolve(user, options);
        })
      },
      beforeUpdate(user, options) {
        if (user.password) {
          return new Promise((resolve) => {
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(user.password, salt);
            return resolve(user, options)
          })
        }
      }
    }
  });
  return User;
};