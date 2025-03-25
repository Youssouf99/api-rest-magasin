const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderArticle = sequelize.define("OrderArticle", {
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  price: { type: DataTypes.FLOAT, allowNull: false },
});

module.exports = OrderArticle;
