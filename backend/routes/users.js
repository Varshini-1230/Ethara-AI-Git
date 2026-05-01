const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const userUpdateValidation = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('role').optional().isIn(['admin', 'member']).withMessage('Invalid role')
];

const inviteValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('role').optional().isIn(['admin', 'member']).withMessage('Invalid role')
];

// Routes
router.get('/', auth, adminOnly, userController.getUsers);
router.put('/:id', auth, userUpdateValidation, userController.updateUser);
router.delete('/:id', auth, adminOnly, userController.deleteUser);
router.post('/invite', auth, adminOnly, inviteValidation, userController.inviteUser);

module.exports = router;