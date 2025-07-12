import express from 'express';
import { getTasks, createTask, updateTask, deleteTask, getTaskById } from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const taskRouter = express.Router();

taskRouter.route('/gp')
    .get(authMiddleware, getTasks)
    .post(authMiddleware, createTask);

taskRouter.route('/:id/gp')
    .get(authMiddleware, getTaskById) // Assuming this is for getting a specific task by ID
    .put(authMiddleware, updateTask)
    .delete(authMiddleware, deleteTask);

export default taskRouter;

// This code defines the routes for task management in an Express application.
// It imports necessary modules and functions, sets up the router, and defines routes for getting, creating, updating, and deleting tasks.