const express = require("express");
const router = express.Router();
const LevelModel = require("../Model/Level");
const Diffmodel = require("../Model/Difficulty");
const authMiddleware = require("../utils/token");

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

// CREATE
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

// READ all levels (manual join to difficulty)
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

// READ single level by MongoDB _id
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

// UPDATE level by MongoDB _id
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

// DELETE level by MongoDB _id
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
