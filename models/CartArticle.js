const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CartArticle = sequelize.define("CartArticle", {
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  price: { type: DataTypes.FLOAT, allowNull: false },
});

module.exports = CartArticle;
