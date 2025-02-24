const express = require("express");
const router = express.Router();
const { Task } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");

// Middleware ensures that only authenticated users can access tasks
router.use(authMiddleware);

/**
 * @route POST /api/tasks
 * @desc Create a new task
 * @access Private (Authenticated Users)
 */

router.post("/", async (req, res) => {
    try {
        const { title, description, status } = req.body;

        // Ensure the required fields are provided
        if(!title) {
            return res.status(400).json({ message: "Title is required"});
        }

        // Create a new task linked to the authenticated user
        const newTask = await Task.create({
            title,
            description,
            status: status || "To-Do",
            userId: req.user.id,    // Get the logged-in user's ID from JWT
        });

        return res.status(201).json(newTask);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message});
    }
});

/**
 * @route GET /api/tasks
 * @desc Get all taks for the authenticated user
 * @access Private (Authenticated Users)
 */

router.get("/", async (req, res) => {
    try {
        // Retrieve tasks belonging to the logged-in user
        const tasks = await Task.findAll({
            where: { userId: req.user.id },
            order: [["createdAt", "DESC"]], // Sort tasks by most recent
        });

        return res.json(tasks);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message});
    }
});

/**
 * @route GET api/tasks/:id
 * @desc Get a specific task by ID
 * @access Private (Authenticated Users)
 */

router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findOne({
            where: {id: req.params.id, userId: req.user.id },
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found"});
        }
        return res.json(task);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message});
    }
});

/**
 * @route PUT /api/tasks/:id
 * @desc Update a task (title, description, status)
 * @access Private (Authenticated Users)
*/

router.put("/:id", async (req, res) => {
    try {
        const {title, description, status } = req.body;

        // Find the task by ID and ensure it belongs to the logged-in user
        const task = await Task.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found"});
        }

        // Update the task with new data
        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;

        await task.save();

        return res.json(task);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message});
    }
});

/**
 * @route DELETE /api/tasks/:id
 * @desc Delete a task
 * @access Private (Authenticated Users)
 */

router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.id, userId: req.user.id},
        });
        
        if (!task) {
            return res.status(404).json({ message: "Task not found"});
        }

        await task.destroy();

        return res.json({ message: "Task deleted successfully"});
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message});
    }
});

module.exports = router;

