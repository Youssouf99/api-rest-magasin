const path = require("path");

module.exports = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API REST Magasin",
      description:
        "API pour gérer les utilisateurs, articles, paniers et commandes",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5001",
      },
    ],
    components: {
      schemas: {
        Article: {
          type: "object",
          required: ["name", "price", "stock"],
          properties: {
            id: {
              type: "integer",
              description: "ID de l'article",
              example: 1,
            },
            name: {
              type: "string",
              description: "Nom de l'article",
              example: "Ordinateur portable",
            },
            description: {
              type: "string",
              description: "Description de l'article",
              example: "Un ordinateur performant",
            },
            price: {
              type: "number",
              description: "Prix de l'article",
              example: 999.99,
            },
            stock: {
              type: "integer",
              description: "Stock disponible",
              example: 50,
            },
          },
        },
        User: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            id: {
              type: "integer",
              description: "ID de l'utilisateur",
              example: 1,
            },
            username: {
              type: "string",
              description: "Nom d'utilisateur",
              example: "john_doe",
            },
            email: {
              type: "string",
              description: "Email de l'utilisateur",
              example: "john.doe@example.com",
            },
            password: {
              type: "string",
              description: "Mot de passe (hashé)",
              example: "hashedpassword123",
            },
          },
        },
        Cart: {
          type: "object",
          required: ["userId", "status"],
          properties: {
            id: {
              type: "integer",
              description: "ID du panier",
              example: 1,
            },
            userId: {
              type: "integer",
              description: "ID de l'utilisateur propriétaire",
              example: 1,
            },
            status: {
              type: "string",
              description: "Statut du panier (ex: 'pending', 'validated')",
              example: "pending",
            },
            total: {
              type: "number",
              description: "Montant total du panier",
              example: 250.75,
            },
          },
        },
        CartArticle: {
          type: "object",
          required: ["cartId", "articleId", "quantity", "price"],
          properties: {
            id: {
              type: "integer",
              description: "ID de l'article dans le panier",
              example: 1,
            },
            cartId: {
              type: "integer",
              description: "ID du panier",
              example: 1,
            },
            articleId: {
              type: "integer",
              description: "ID de l'article",
              example: 5,
            },
            quantity: {
              type: "integer",
              description: "Quantité de l'article dans le panier",
              example: 3,
            },
            price: {
              type: "number",
              description: "Prix unitaire de l'article dans le panier",
              example: 299.99,
            },
          },
        },
        Order: {
          type: "object",
          required: ["userId", "totalAmount", "status"],
          properties: {
            id: {
              type: "integer",
              description: "ID de la commande",
              example: 1,
            },
            userId: {
              type: "integer",
              description: "ID de l'utilisateur ayant passé la commande",
              example: 1,
            },
            totalAmount: {
              type: "number",
              description: "Montant total de la commande",
              example: 250.75,
            },
            status: {
              type: "string",
              description: "Statut de la commande (ex: 'pending', 'shipped')",
              example: "pending",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Erreur interne du serveur",
            },
            code: {
              type: "integer",
              example: 500,
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "routes", "*.js")], // Tous les fichiers de routes
};
