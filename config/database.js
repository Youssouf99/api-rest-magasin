const { Sequelize } = require("sequelize");
require("dotenv").config();

// Vérification des variables d'environnement
const requiredEnv = [
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_DIALECT",
  "DB_PORT",
];
requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.error(`❌ Erreur : La variable ${env} est manquante.`);
    process.exit(1);
  }
});

console.log("📡 Tentative de connexion à MySQL...");
console.log(`🔗 Host: ${process.env.DB_HOST}`);
console.log(`🔗 Port: ${process.env.DB_PORT}`);
console.log(`🔗 Database: ${process.env.DB_NAME}`);
console.log(`🔗 User: ${process.env.DB_USER}`);
console.log(`🔗 Dialect: ${process.env.DB_DIALECT}`);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: console.log, // Active les logs SQL
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion MySQL réussie !");
  } catch (err) {
    console.error("❌ Erreur de connexion MySQL:", err.message);
    console.error("📄 Stack trace:", err);
    process.exit(1);
  }
})();

module.exports = sequelize;
