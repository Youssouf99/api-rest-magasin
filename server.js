const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerConfig = require("./swaggerConfig");

const articleRoutes = require("./routes/articleRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const port = process.env.PORT || 5001;

// Générer la documentation Swagger
const swaggerDocs = swaggerJSDoc(swaggerConfig);

// Utiliser Swagger UI pour afficher la documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Utilisation de body-parser pour gérer les requêtes JSON
app.use(bodyParser.json());

// Définir les routes
app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
  console.log(`📄 Swagger docs available at http://localhost:${port}/api-docs`);
});
