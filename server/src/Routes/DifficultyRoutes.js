const express = require("express");
const router = express.Router();
const Diffmodel = require("../Model/Difficulty"); // adjust path as needed
const authMiddleware = require("../utils/token");

// CREATE a new difficulty
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

// READ all difficulties
router.get("/", authMiddleware, async (req, res) => {
    try {
        const difficulties = await Diffmodel.find();
        res.status(200).json(difficulties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ single difficulty by id
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
