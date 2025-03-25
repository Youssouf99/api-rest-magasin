const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de l'utilisateur
 *           example: 1
 *         name:
 *           type: string
 *           description: Nom de l'utilisateur
 *           example: "John Doe"
 *         email:
 *           type: string
 *           description: Adresse email de l'utilisateur
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           description: Mot de passe hashé de l'utilisateur
 *           example: "$2a$10$..."
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: "Créer un nouvel utilisateur"
 *     description: "Permet d'enregistrer un nouvel utilisateur avec un mot de passe sécurisé."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: "Utilisateur créé avec succès"
 *       500:
 *         description: "Erreur serveur"
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "Utilisateur créé avec succès", user });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: "Connexion d'un utilisateur"
 *     description: "Permet à un utilisateur de se connecter et d'obtenir un token JWT."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: "Connexion réussie, renvoie un token"
 *       400:
 *         description: "Mot de passe incorrect"
 *       404:
 *         description: "Utilisateur non trouvé"
 *       500:
 *         description: "Erreur serveur"
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Connexion réussie", token });
  } catch (error) {
    console.error("Erreur lors de la connexion de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
