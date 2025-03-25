const sequelize = require("../config/database");
const User = require("./User");
const Article = require("./Article");
const Cart = require("./Cart");
const CartArticle = require("./CartArticle");
const Order = require("./Order");
const OrderArticle = require("./OrderArticle");

// Définition des relations
User.hasMany(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Article.belongsToMany(Cart, { through: CartArticle, foreignKey: "articleId" });
Cart.belongsToMany(Article, { through: CartArticle, foreignKey: "cartId" });

Article.belongsToMany(Order, {
  through: OrderArticle,
  foreignKey: "articleId",
});
Order.belongsToMany(Article, { through: OrderArticle, foreignKey: "orderId" });

// ✅ Fonction pour synchroniser la base de données
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Use { force: true } if you want to reset tables
    console.log("✅ Base de données synchronisée avec succès !");
  } catch (error) {
    console.error("❌ Erreur de synchronisation :", error);
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Article,
  Cart,
  CartArticle,
  Order,
  OrderArticle,
};
