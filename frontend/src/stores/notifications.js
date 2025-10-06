import { defineStore } from 'pinia'
import api from '../utils/axios-api'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null
  }),

  actions: {
    async fetchNotifications() {
      this.loading = true
      try {
        const response = await api.get('/noti/')
        this.notifications = response.data
        this.unreadCount = this.notifications.filter(n => !n.read_status).length
      } catch (error) {
        this.error = error?.message || 'Failed to fetch notifications'
      } finally {
        this.loading = false
      }
    },

    async markAsRead(id) {
      try {
        await api.put(`/notifications/${id}/read`)
        const index = this.notifications.findIndex(n => n.id === id)
        if (index !== -1) {
          this.notifications[index].read_status = true
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        }
      } catch (error) {
        this.error = error?.message || 'Failed to mark notification as read'
      }
    },

    async markAllAsRead() {
      try {
        await api.put('/notifications/read-all')
        this.notifications = this.notifications.map(n => ({ ...n, read_status: true }))
        this.unreadCount = 0
      } catch (error) {
        this.error = error?.message || 'Failed to mark all as read'
      }
    }
  }
})
