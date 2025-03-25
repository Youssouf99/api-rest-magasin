const express = require("express");
const { Cart, CartArticle, Article } = require("../models");

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "ID du panier"
 *           example: 1
 *         userId:
 *           type: integer
 *           description: "ID de l'utilisateur"
 *           example: 2
 *         status:
 *           type: string
 *           description: "Statut du panier (ex: 'pending', 'validated')"
 *           example: "pending"
 *     CartArticle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "ID de l'article du panier"
 *           example: 1
 *         cartId:
 *           type: integer
 *           description: "ID du panier associé"
 *           example: 1
 *         articleId:
 *           type: integer
 *           description: "ID de l'article"
 *           example: 5
 *         quantity:
 *           type: integer
 *           description: "Quantité d'articles"
 *           example: 3
 */

/**
 * @swagger
 * /api/carts/{userId}:
 *   get:
 *     summary: "Récupérer le panier en cours d'un utilisateur"
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID de l'utilisateur"
 *     responses:
 *       200:
 *         description: "Panier récupéré avec succès"
 *       404:
 *         description: "Panier non trouvé"
 *       500:
 *         description: "Erreur serveur"
 */
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.params.userId, status: "pending" },
    });
    if (!cart) {
      return res.status(404).json({ error: "Panier non trouvé" });
    }
    const CartArticles = await CartArticle.findAll({
      where: { cartId: cart.id },
    });
    res.json({ cart, CartArticles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/carts/{userId}/add:
 *   post:
 *     summary: "Ajouter un article au panier"
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID de l'utilisateur"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: integer
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: "Article ajouté au panier"
 *       400:
 *         description: "Article non disponible ou quantité invalide"
 *       500:
 *         description: "Erreur serveur"
 */
router.post("/:userId/add", async (req, res) => {
  try {
    const { articleId, quantity } = req.body;

    let cart = await Cart.findOne({
      where: { userId: req.params.userId, status: "pending" },
    });

    if (!cart) {
      cart = await Cart.create({
        userId: req.params.userId,
        status: "pending",
      });
    }

    const article = await Article.findByPk(articleId);
    if (!article || article.stock < quantity) {
      return res
        .status(400)
        .json({ error: "Article non disponible ou stock insuffisant" });
    }

    const CartArticle = await CartArticle.create({
      cartId: cart.id,
      articleId,
      quantity,
    });

    res.status(201).json(CartArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/carts/{userId}/update:
 *   put:
 *     summary: "Mettre à jour la quantité d'un article dans le panier"
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID de l'utilisateur"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: integer
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       200:
 *         description: "Quantité mise à jour"
 *       400:
 *         description: "Quantité invalide"
 *       500:
 *         description: "Erreur serveur"
 */
router.put("/:userId/update", async (req, res) => {
  try {
    const { articleId, quantity } = req.body;
    const cart = await Cart.findOne({
      where: { userId: req.params.userId, status: "pending" },
    });

    if (!cart) {
      return res.status(404).json({ error: "Panier non trouvé" });
    }

    const CartArticle = await CartArticle.findOne({
      where: { cartId: cart.id, articleId },
    });

    if (!CartArticle) {
      return res
        .status(404)
        .json({ error: "Article non trouvé dans le panier" });
    }

    CartArticle.quantity = quantity;
    await CartArticle.save();
    res.json(CartArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/carts/{userId}/remove:
 *   delete:
 *     summary: "Supprimer un article du panier"
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID de l'utilisateur"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: "Article supprimé"
 *       404:
 *         description: "Article non trouvé dans le panier"
 *       500:
 *         description: "Erreur serveur"
 */
router.delete("/:userId/remove", async (req, res) => {
  try {
    const { articleId } = req.body;
    const cart = await Cart.findOne({
      where: { userId: req.params.userId, status: "pending" },
    });

    if (!cart) {
      return res.status(404).json({ error: "Panier non trouvé" });
    }

    const CartArticle = await CartArticle.findOne({
      where: { cartId: cart.id, articleId },
    });

    if (!CartArticle) {
      return res
        .status(404)
        .json({ error: "Article non trouvé dans le panier" });
    }

    await CartArticle.destroy();
    res.json({ message: "Article supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
