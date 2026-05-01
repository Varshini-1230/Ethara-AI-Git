const express = require('express');
const notificationController = require('../controllers/notificationController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/', auth, notificationController.getNotifications);
router.put('/:id/read', auth, notificationController.markAsRead);
router.put('/read-all', auth, notificationController.markAllAsRead);
router.delete('/:id', auth, notificationController.deleteNotification);

module.exports = router;