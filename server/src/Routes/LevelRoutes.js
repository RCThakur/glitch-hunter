const express = require("express");
const router = express.Router();
const LevelModel = require("../Model/Level");
const Diffmodel = require("../Model/Difficulty");
const authMiddleware = require("../utils/token");

/**
 * @swagger
 * tags:
 *   name: Levels
 *   description: Game level management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LevelInput:
 *       type: object
 *       required:
 *         - name
 *         - bots
 *         - bullets
 *         - difficulty
 *         - defaultTime
 *       properties:
 *         name:
 *           type: number
 *           description: Level number
 *         bots:
 *           type: number
 *           description: Number of bots in the level
 *         bullets:
 *           type: number
 *           description: Number of bullets available
 *         difficulty:
 *           type: number
 *           description: Difficulty ID
 *         defaultTime:
 *           type: number
 *           description: Default time for the level
 */

// Validate request body
async function validateLevelData(data) {
    const { defaultTime, name, bots, bullets, difficulty } = data;

    if (typeof defaultTime !== "number") return "defaultTime must be a number";
    if (typeof name !== "number") return "name must be a number";
    if (typeof bots !== "number") return "bots must be a number";
    if (typeof bullets !== "number") return "bullets must be a number";
    if (typeof difficulty !== "number") return "difficulty must be a number";

    // Check if difficulty exists by its numeric id
    const diffExists = await Diffmodel.findOne({ _id: difficulty });
    if (!diffExists) return "Difficulty with this id does not exist";

    return null;
}

/**
 * @swagger
 * /api/level:
 *   post:
 *     summary: Create a new level
 *     tags: [Levels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LevelInput'
 *     responses:
 *       201:
 *         description: Level created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Level'
 *       400:
 *         description: Invalid input or level already exists
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, async (req, res) => {
    try {

        const error = await validateLevelData(req.body);
        if (error) return res.status(400).json({ message: error });

        // Prevent duplicate level with same name + difficulty
        const existing = await LevelModel.findOne({ name: req.body.name, difficulty: req.body.difficulty });
        if (existing) return res.status(400).json({ message: "Level with this name & difficulty already exists" });

        const level = new LevelModel(req.body);
        await level.save();
        res.status(201).json(level);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/level:
 *   get:
 *     summary: Get all levels
 *     tags: [Levels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all levels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Level'
 *                   - type: object
 *                     properties:
 *                       difficulty:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           name:
 *                             type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, async (req, res) => {
    try {
        const levels = await LevelModel.find();
        const difficulties = await Diffmodel.find();

        // attach difficulty details manually
        const response = levels.map(level => {
            const diff = difficulties.find(d => d._id === level.difficulty);
            return {
                ...level.toObject(),
                difficulty: diff ? { id: diff._id, name: diff.name } : null
            };
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/level/{id}:
 *   get:
 *     summary: Get a specific level
 *     tags: [Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Level ID
 *     responses:
 *       200:
 *         description: Level details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Level'
 *                 - type: object
 *                   properties:
 *                     difficulty:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         name:
 *                           type: string
 *       404:
 *         description: Level not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const level = await LevelModel.findById(req.params.id);
        if (!level) return res.status(404).json({ message: "Level not found" });

        const diff = await Diffmodel.findOne({ id: level.difficulty });
        res.status(200).json({
            ...level.toObject(),
            difficulty: diff ? { id: diff.id, name: diff.name } : null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/level/{id}:
 *   put:
 *     summary: Update a level
 *     tags: [Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Level ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LevelInput'
 *     responses:
 *       200:
 *         description: Level updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Level'
 *                 - type: object
 *                   properties:
 *                     difficulty:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         name:
 *                           type: string
 *       404:
 *         description: Level not found
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const error = await validateLevelData(req.body);
        if (error) return res.status(400).json({ message: error });

        const level = await LevelModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!level) return res.status(404).json({ message: "Level not found" });

        const diff = await Diffmodel.findOne({ id: level.difficulty });
        res.status(200).json({
            ...level.toObject(),
            difficulty: diff ? { id: diff.id, name: diff.name } : null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/level/{id}:
 *   delete:
 *     summary: Delete a level
 *     tags: [Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Level ID
 *     responses:
 *       200:
 *         description: Level deleted successfully
 *       404:
 *         description: Level not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const level = await LevelModel.findByIdAndDelete(req.params.id);
        if (!level) return res.status(404).json({ message: "Level not found" });

        res.status(200).json({ message: "Level deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
