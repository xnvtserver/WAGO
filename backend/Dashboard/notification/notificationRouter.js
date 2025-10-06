import express from 'express'
import { notificationController } from './notificationController.js'
import { authenticate } from '../../middleware/auth.js';

const router = express.Router()

router.get('/', authenticate, notificationController.getNotifications);
router.put('/:id/read', authenticate, notificationController.markAsRead);
router.put('/read-all', authenticate, notificationController.markAllAsRead);

export default router

// To use this system:
// Create notifications through your backend services
// Call the notifications store when needed:
// typescript
// const notifications = useNotificationsStore()
// await notifications.fetchNotifications()