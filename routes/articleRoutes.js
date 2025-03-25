const express = require("express");
const router = express.Router();
const { Article } = require("../models");

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Gestion des articles
 */

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: "Récupérer tous les articles"
 *     description: "Retourne la liste de tous les articles disponibles."
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: "Liste des articles récupérée avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */
router.get("/", async (req, res) => {
  try {
    const articles = await Article.findAll();
    res.json(articles);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des articles" });
  }
});

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: "Récupérer un article par son ID"
 *     description: "Retourne un article spécifique."
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID de l'article"
 *     responses:
 *       200:
 *         description: "Article récupéré avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: "Article non trouvé"
 */
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article non trouvé" });
    }
    res.json(article);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'article" });
  }
});

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: "Créer un nouvel article"
 *     description: "Ajoute un article à la base de données."
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       201:
 *         description: "Article créé avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: "Requête invalide"
 */
router.post("/", async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res
        .status(400)
        .json({ error: "Tous les champs obligatoires doivent être remplis" });
    }

    const article = await Article.create({ name, description, price, stock });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de l'article" });
  }
});

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: "Mettre à jour un article"
 *     description: "Modifie les informations d'un article existant."
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID de l'article"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       200:
 *         description: "Article mis à jour avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: "Article non trouvé"
 */
router.put("/:id", async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Article non trouvé" });
    }

    article.name = name || article.name;
    article.description = description || article.description;
    article.price = price || article.price;
    article.stock = stock || article.stock;

    await article.save();
    res.json(article);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l'article" });
  }
});

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: "Supprimer un article"
 *     description: "Supprime un article de la base de données."
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID de l'article"
 *     responses:
 *       200:
 *         description: "Article supprimé avec succès"
 *       404:
 *         description: "Article non trouvé"
 */
router.delete("/:id", async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Article non trouvé" });
    }

    await article.destroy();
    res.json({ message: "Article supprimé" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'article" });
  }
});

module.exports = router;
