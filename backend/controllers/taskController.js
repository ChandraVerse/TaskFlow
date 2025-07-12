import Task from '../models/taskModel.js';
// create a new task
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, completed } = req.body;
        const task = new Task({ title, description, priority: priority.toLowerCase(), dueDate, completed: completed === 'True' || completed === 'Yes', owner: req.user.id });
        const saved = await task.save();
        res.status(201).json({ success: true, task: saved });
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
};
// get all tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};
// get single task by id
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error });
    }
};
// update task by id
const updateTask = async (req, res) => {
    try {
        const data = {...req.body};
        if (!data.completed !== undefined) {
            data.completed = data.completed === 'True' || data.completed === 'Yes';
        }
        if (data.priority) {
            data.priority = data.priority.toLowerCase();
        }
        const updated = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, data, { new: true, runValidators: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.status(200).json({ success: true, task: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
};
// delete task 
const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.status(204).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
};

export { createTask, getTasks, getTaskById, updateTask, deleteTask };