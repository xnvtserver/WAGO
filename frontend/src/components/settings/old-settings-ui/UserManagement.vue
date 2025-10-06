<!-- components/settings/UserManagement.vue -->
<template>
  <div class="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="...">User Management</h2>
        <button @click="$emit('open-add-user')" class="...">Add User</button>
      </div>
    </div>
    <table class="min-w-full divide-y divide-gray-200">
      <!-- User list -->
      <tr v-for="user in settingsStore.users" :key="user.id">
        <td class="...">{{ user.name }}</td>
        <!-- Other columns -->
      </tr>
    </table>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settingsStore';

const settingsStore = useSettingsStore();
</script>