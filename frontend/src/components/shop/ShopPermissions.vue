<template>
  <div class="p-6">
    <!-- Header and Create Button -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Shop Permissions Management</h2>
      <button 
        @click="openCreateDialog"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <span class="material-icons">add</span>
        Add Permission
      </button>
    </div>

    <!-- Permissions List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b">
        <div class="font-medium">User</div>
        <div class="font-medium">Role</div>
        <div class="font-medium">Permissions</div>
        <div class="font-medium">Actions</div>
      </div>

      <div v-if="loading" class="p-4 text-center text-gray-500">
        Loading permissions...
      </div>

      <div v-else-if="permissions.length === 0" class="p-4 text-center text-gray-500">
        No permissions found for this shop
      </div>

      <div v-else>
        <div 
          v-for="item in permissions" 
          :key="item.id"
          class="grid grid-cols-4 gap-4 p-4 border-b hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center">
            {{ item.user?.email || 'N/A' }}
          </div>
          <div>
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {{ item.role }}
            </span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="permission in item.permissions" 
              :key="permission"
              class="bg-gray-100 px-2 py-1 rounded text-sm"
            >
              {{ permission }}
            </span>
          </div>
          <div class="flex items-center gap-4">
            <button 
              @click="editPermission(item)"
              class="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span class="material-icons text-base">edit</span>
              Edit
            </button>
            <button 
              @click="deletePermission(item.id)"
              class="text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <span class="material-icons text-base">delete</span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <div 
      v-if="showCreateDialog" 
      class="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg w-full max-w-md">
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">
            {{ editing ? 'Edit Permission' : 'Create New Permission' }}
          </h3>
          <button @click="cancelEdit" class="text-gray-500 hover:text-gray-700">
            <span class="material-icons">close</span>
          </button>
        </div>

        <form @submit.prevent="savePermission" class="p-4 space-y-4">
          <!-- User Selection -->
          <div>
            <label class="block text-sm font-medium mb-1">Select User</label>
            <select
              v-model="form.user_id"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="" disabled>Select a user</option>
              <option 
                v-for="user in users" 
                :key="user.id" 
                :value="user.id"
              >
                {{ user.email }}
              </option>
            </select>
          </div>

          <!-- Role Selection -->
<div>
  <label class="block text-sm font-medium mb-1">Select Role</label>
  <select
    v-model="form.role"
    class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
    required
  >
    <option value="" disabled>Select a role</option>
    <option value="manager">Manager</option>
    <option value="cashier">Cashier</option>
    <option value="inventory_staff">Inventory Staff</option>
  </select>
</div>

          <!-- Permissions Selection -->
          <div>
            <label class="block text-sm font-medium mb-1">Select Permissions</label>
            <div class="grid grid-cols-2 gap-2">
              <label 
                v-for="permission in availablePermissions" 
                :key="permission"
                class="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  v-model="form.permissions"
                  :value="permission"
                  class="rounded text-blue-600 focus:ring-blue-500"
                >
                <span class="text-sm">{{ permission }}</span>
              </label>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <span v-if="loading" class="animate-spin material-icons">refresh</span>
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Error Message -->
    <div 
      v-if="error"
      class="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
import { useShopPermissionsStore } from '@/stores/shopPermissions';
import { useAuthStore } from '@/stores/auth';

export default {
  props: {
    shopId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      showCreateDialog: false,
      editing: false,
      loading: false,
      error: null,
      form: {
        id: null,
        user_id: '',
        role: '',
        permissions: []
      },
      roles: ['manager', 'cashier', 'inventory_staff'],
      availablePermissions: [
        'manage_inventory',
        'process_sales',
        'view_reports',
        'manage_pricing'
      ]
    };
  },

  computed: {
    permissions() {
      return useShopPermissionsStore().permissions;
    },
    users() {
      return useAuthStore().users || [];
    }
  },

  async mounted() {
    await this.fetchPermissions();
    await this.fetchUsers();
  },

  methods: {
    async fetchPermissions() {
      try {
        this.loading = true;
        await useShopPermissionsStore().fetchPermissions(this.shopId);
      } catch (error) {
        this.showError(error.message);
      } finally {
        this.loading = false;
      }
    },

    async fetchUsers() {
      try {
        await useAuthStore().fetchUsers();
      } catch (error) {
        this.showError('Failed to load users');
      }
    },

    openCreateDialog() {
      this.showCreateDialog = true;
    },

editPermission(permission) {
    console.log('Editing permission:', permission);
  this.form = {
    id: permission.id,
    user_id: permission.user_id,
    role: permission.role,
    permissions: Array.isArray(permission.permissions) ? [...permission.permissions] : []
  };
  this.editing = true;
  this.showCreateDialog = true;
},


    async savePermission() {
      try {
        this.loading = true;
        this.error = null;

        if (!this.form.user_id || !this.form.role) {
          throw new Error('Please select a user and role');
        }

        const store = useShopPermissionsStore();
        const payload = {
          user_id: this.form.user_id,
          role: this.form.role,
          permissions: this.form.permissions
        };

        if (this.editing) {
          await store.updatePermission(this.shopId, this.form.id, payload);
        } else {
          await store.createPermission(this.shopId, payload);
        }

        this.cancelEdit();
        await this.fetchPermissions();
      } catch (error) {
        this.showError(error.message);
      } finally {
        this.loading = false;
      }
    },

    async deletePermission(id) {
      if (confirm('Are you sure you want to delete this permission?')) {
        try {
          this.loading = true;
          await useShopPermissionsStore().deletePermission(this.shopId, id);
          await this.fetchPermissions();
        } catch (error) {
          this.showError(error.message);
        } finally {
          this.loading = false;
        }
      }
    },

    cancelEdit() {
      this.showCreateDialog = false;
      this.editing = false;
      this.resetForm();
    },

    resetForm() {
      this.form = {
        id: null,
        user_id: '',
        role: '',
        permissions: []
      };
    },

    showError(message) {
      this.error = message;
      setTimeout(() => this.error = null, 5000);
    }
  }
};
</script>