const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const taskValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Task title is required'),
  body('projectId').isMongoId().withMessage('Valid project ID is required'),
  body('assignedTo').optional().isMongoId().withMessage('Valid user ID required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').optional().isIn(['todo', 'in_progress', 'done', 'overdue']).withMessage('Invalid status'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format')
];

// Routes
router.get('/', auth, taskController.getTasks);
router.post('/', auth, taskValidation, taskController.createTask);
router.put('/:id', auth, taskValidation, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);
router.get('/stats/dashboard', auth, taskController.getDashboardStats);

module.exports = router;