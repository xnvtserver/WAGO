<!-- components/settings/AddUserModal.vue -->
<template>
    <div v-if="show" class="fixed z-50 inset-0 overflow-y-auto">
      <!-- Modal content from original HTML -->
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onclick="closeAddUserModal()"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Add New User</h3>
                    <div class="mt-4 space-y-4">
                        <div>
                            <label for="new-user-name" class="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="new-user-name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
                        </div>
                        <div>
                            <label for="new-user-email" class="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="new-user-email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
                        </div>
                        <div>
                            <label for="new-user-role" class="block text-sm font-medium text-gray-700">Role</label>
                            <select id="new-user-role" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="staff" selected>Staff</option>
                            </select>
                        </div>
                        <div>
                            <label for="new-user-password" class="block text-sm font-medium text-gray-700">Temporary Password</label>
                            <input type="password" id="new-user-password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Add User
                    </button>
                    <button type="button" onclick="closeAddUserModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
  </template>
  
<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useSettingsStore } from '@/stores/settingsStore';
const props = defineProps(['show']);
const emit = defineEmits(['close']);
const settingsStore = useSettingsStore();
const form = ref({ name: '', email: '', role: 'staff', password: '' });

const handleSubmit = async () => {
  await settingsStore.createShopUser(form.value);
  emit('close');
};
</script>