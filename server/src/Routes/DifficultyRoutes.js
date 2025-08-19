const express = require("express");
const router = express.Router();
const Diffmodel = require("../Model/Difficulty"); // adjust path as needed
const authMiddleware = require("../utils/token");

/**
 * @swagger
 * tags:
 *   name: Difficulty
 *   description: Game difficulty management
 */

/**
 * @swagger
 * /api/difficulty:
 *   post:
 *     summary: Create a new difficulty level
 *     tags: [Difficulty]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *               - name
 *             properties:
 *               _id:
 *                 type: number
 *                 description: Difficulty ID
 *               name:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 description: Difficulty name
 *     responses:
 *       201:
 *         description: Difficulty created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Difficulty'
 *       400:
 *         description: Invalid input or difficulty already exists
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { _id, name } = req.body;
        if (!_id || !name) {
            return res.status(400).json({ message: "id and name are required" });
        }

        const existing = await Diffmodel.findOne({ _id });
        if (existing) {
            return res.status(400).json({ message: "Difficulty with this id already exists" });
        }

        const difficulty = new Diffmodel({ _id, name });
        await difficulty.save();
        res.status(201).json(difficulty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/difficulty:
 *   get:
 *     summary: Get all difficulty levels
 *     tags: [Difficulty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all difficulties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Difficulty'
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, async (req, res) => {
    try {
        const difficulties = await Diffmodel.find();
        res.status(200).json(difficulties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/difficulty/{id}:
 *   get:
 *     summary: Get a specific difficulty level
 *     tags: [Difficulty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Difficulty ID
 *     responses:
 *       200:
 *         description: Difficulty details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Difficulty'
 *       404:
 *         description: Difficulty not found
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/difficulty/{id}:
 *   get:
 *     summary: Get a specific difficulty level
 *     tags: [Difficulty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Difficulty ID
 *     responses:
 *       200:
 *         description: Difficulty details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Difficulty'
 *       404:
 *         description: Difficulty not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const difficulty = await Diffmodel.findOne({ _id: req.params.id });
        if (!difficulty) {
            return res.status(404).json({ message: "Difficulty not found" });
        }
        res.status(200).json(difficulty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE difficulty by id
/**
 * @swagger
 * /api/difficulty/{id}:
 *   put:
 *     summary: Update a difficulty level
 *     tags: [Difficulty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Difficulty ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 description: New difficulty name
 *     responses:
 *       200:
 *         description: Difficulty updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Difficulty'
 *       404:
 *         description: Difficulty not found
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        const difficulty = await Diffmodel.findOneAndUpdate(
            { _id: req.params.id },
            { name },
            { new: true, runValidators: true }
        );
        if (!difficulty) {
            return res.status(404).json({ message: "Difficulty not found" });
        }
        res.status(200).json(difficulty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE difficulty by id
/**
 * @swagger
 * /api/difficulty/{id}:
 *   delete:
 *     summary: Delete a difficulty level
 *     tags: [Difficulty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Difficulty ID
 *     responses:
 *       200:
 *         description: Difficulty deleted successfully
 *       404:
 *         description: Difficulty not found
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Cannot delete difficulty that has associated levels
 */
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const difficulty = await Diffmodel.findOneAndDelete({ _id: req.params.id });
        if (!difficulty) {
            return res.status(404).json({ message: "Difficulty not found" });
        }
        res.status(200).json({ message: "Difficulty deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
