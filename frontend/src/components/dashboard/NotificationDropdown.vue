<template>
  <div class="relative" @click.stop="toggleNotifications">
    <button class="text-white-500 hover:text-white-700 relative focus:outline-none">
      <i class="fas fa-bell text-xl"></i>
      <span v-if="unreadCount > 0" class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>

    <div
      v-if="showNotifications"
      class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50"
    >
      <div class="p-4 border-b font-semibold text-gray-700 flex justify-between items-center">
        <span>Notifications</span>
        <button 
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="text-blue-600 text-xs hover:underline"
        >
          Mark all as read
        </button>
      </div>
      <ul v-if="!loading" class="max-h-60 overflow-y-auto text-sm text-gray-600">
        <li 
          v-for="notification in notifications"
          :key="notification.id"
          @click="markAsRead(notification.id)"
          class="p-3 hover:bg-gray-50 border-b cursor-pointer"
          :class="{ 'bg-blue-50': !notification.read_status }"
        >
          <div class="flex items-center">
            <span class="mr-2">{{ getIcon(notification.type) }}</span>
            <div>
              <p class="font-medium">{{ notification.content }}</p>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatDate(notification.created_at) }}
              </p>
            </div>
          </div>
        </li>
        <li 
          v-if="notifications.length === 0"
          class="p-4 text-center text-gray-500"
        >
          No notifications
        </li>
      </ul>
      <div class="p-3 text-center text-blue-600 hover:underline cursor-pointer">
        View All
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'
import { format } from 'date-fns'

const notificationsStore = useNotificationsStore()
const showNotifications = ref(false)
const unreadCount = computed(() => notificationsStore.unreadCount)
const notifications = computed(() => notificationsStore.notifications)
const loading = computed(() => notificationsStore.loading)

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    await notificationsStore.fetchNotifications()
  }
}

const markAsRead = async (id: number) => {
  await notificationsStore.markAsRead(id)
}

const markAllAsRead = async () => {
  await notificationsStore.markAllAsRead()
}

const getIcon = (type: string) => {
  const icons: Record<string, string> = {
    order: '🛒',
    inventory: '📦',
    message: '💬',
    system: '⚠️'
  }
  return icons[type] || 'ℹ️'
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM d, HH:mm')
}
</script>
