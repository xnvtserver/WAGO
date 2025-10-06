<!-- components/settings/modals/EditUserModal.vue -->
<template>
  <div v-if="show" class="fixed z-50 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Edit User</h3>
          
          <div class="mt-4 space-y-4">
            <div class="flex items-center">
              <img class="h-10 w-10 rounded-full" :src="user.avatar" alt="User avatar">
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Role</label>
              <select v-model="form.role" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
                <option value="manager">Manager</option>
                <option value="cashier">Cashier</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Permissions</label>
              <div class="mt-2 space-y-2">
                <div v-for="permission in availablePermissions" :key="permission" class="flex items-center">
                  <input 
                    type="checkbox" 
                    :id="permission" 
                    :value="permission"
                    v-model="form.permissions"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                  <label :for="permission" class="ml-2 text-sm text-gray-700 capitalize">
                    {{ permission.replace('_', ' ') }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            @click="saveChanges"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Save Changes
          </button>
          <button 
            type="button" 
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import { useSettingsStore } from '@/stores/settingsStore';

const props = defineProps({
  show: Boolean,
  user: Object
});

const emit = defineEmits(['close', 'updated']);

const settingsStore = useSettingsStore();
const form = ref({
  role: 'staff',
  permissions: []
});

const availablePermissions = [
  'view_dashboard',
  'manage_inventory',
  'process_sales',
  'view_reports',
  'manage_pricing',
  'handle_customers'
];

// Watch for user prop changes to update form
watch(() => props.user, (newUser) => {
  if (newUser) {
    form.value = {
      role: newUser.shop_role || 'staff',
      permissions: newUser.permissions || []
    };
  }
}, { immediate: true });

const saveChanges = async () => {
  try {
    await settingsStore.updateUser({
      userId: props.user.id,
      ...form.value
    });
    emit('updated');
    emit('close');
  } catch (error) {
    console.error('Error updating user:', error);
  }
};
</script>