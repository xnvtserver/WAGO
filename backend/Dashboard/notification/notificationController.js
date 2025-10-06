import knex from '../../db/knex.js'

export const notificationController = {
  async getNotifications(req, res) {
    try {
      const shopId = req.user?.shop_id;
          if (!shopId) {
      return res.status(400).json({ error: 'Missing shop ID' });
    }
      const notifications = await knex('notifications')
        .leftJoin('notification_statuses', 'notifications.id', 'notification_statuses.notification_id')
        .select(
          'notifications.*',
          knex.raw('COALESCE(notification_statuses.read_status, false) as read_status')
        )
        .where('notifications.shop_id', shopId)
        .orderBy('notifications.created_at', 'desc');
      res.json(notifications);
    } catch (error) {
      console.error('Error in getNotifications:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  },

  async markAsRead(req, res) {
    try {
      const notificationId = req.params.id
      const shopId = req.user?.shop_id

      await knex('notification_statuses')
        .insert({
          notification_id: notificationId,
          shop_id: shopId,
          read_status: true
        })
        .onConflict(['notification_id', 'shop_id'])
        .merge()

      res.json({ success: true })
    } catch (error) {
      console.error('Error in markAsRead:', error)
      res.status(500).json({ error: 'Failed to mark notification as read' })
    }
  },

  async markAllAsRead(req, res) {
    try {
      const shopId = req.user?.shop_id

      const notificationIds = await knex('notifications')
        .where('shop_id', shopId)
        .pluck('id')

      await knex('notification_statuses')
        .insert(notificationIds.map(id => ({
          notification_id: id,
          shop_id: shopId,
          read_status: true
        })))
        .onConflict(['notification_id', 'shop_id'])
        .merge()

      res.json({ success: true })
    } catch (error) {
      console.error('Error in markAllAsRead:', error)
      res.status(500).json({ error: 'Failed to mark all as read' })
    }
  }
}
