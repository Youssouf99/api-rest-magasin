const express = require("express");
const { Order, OrderItem, CartItem, Cart, Article } = require("../models");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la commande
 *           example: 1
 *         userId:
 *           type: integer
 *           description: ID de l'utilisateur
 *           example: 2
 *         total:
 *           type: float
 *           description: Montant total de la commande
 *           example: 99.99
 *         status:
 *           type: string
 *           description: Statut de la commande ("pending", "completed")
 *           example: "pending"
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: "Créer une commande à partir du panier"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: "Commande créée avec succès"
 *       400:
 *         description: "Panier non trouvé ou vide"
 *       500:
 *         description: "Erreur serveur"
 */
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ where: { userId, status: "pending" } });
    if (!cart) {
      return res.status(400).json({ error: "Panier non trouvé ou vide" });
    }

    const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });
    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Panier vide" });
    }

    let total = 0;
    for (const item of cartItems) {
      const article = await Article.findByPk(item.articleId);
      if (!article || article.stock < item.quantity) {
        return res.status(400).json({
          error: `Stock insuffisant pour l'article ${item.articleId}`,
        });
      }
      total += article.price * item.quantity;
    }

    const order = await Order.create({
      userId,
      total,
      status: "pending",
    });

    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        articleId: item.articleId,
        quantity: item.quantity,
        price: item.price,
      });

      // Mise à jour du stock des articles
      const article = await Article.findByPk(item.articleId);
      article.stock -= item.quantity;
      await article.save();
    }

    cart.status = "completed";
    await cart.save();

    res.status(201).json({ message: "Commande créée", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/orders/{userId}:
 *   get:
 *     summary: "Récupérer toutes les commandes d'un utilisateur"
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: "Liste des commandes récupérée avec succès"
 *       500:
 *         description: "Erreur serveur"
 */
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.params.userId },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/orders/{orderId}/validate:
 *   put:
 *     summary: "Valider une commande"
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: "Commande validée avec succès"
 *       404:
 *         description: "Commande non trouvée"
 *       500:
 *         description: "Erreur serveur"
 */
router.put("/:orderId/validate", async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    order.status = "completed";
    await order.save();

    res.json({ message: "Commande validée", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
