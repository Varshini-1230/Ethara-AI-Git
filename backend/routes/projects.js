const express = require('express');
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const projectValidation = [
  body('name').trim().isLength({ min: 1 }).withMessage('Project name is required'),
  body('description').optional().trim(),
  body('members').optional().isArray().withMessage('Members must be an array')
];

// Routes
router.get('/', auth, projectController.getProjects);
router.post('/', auth, adminOnly, projectValidation, projectController.createProject);
router.put('/:id', auth, projectValidation, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);
router.post('/:id/members', auth, projectController.addMember);
router.delete('/:id/members/:userId', auth, projectController.removeMember);

module.exports = router;