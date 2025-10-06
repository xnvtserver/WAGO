<template>
  <div
    :class="[
      'border rounded-lg p-4 hover:shadow-md transition',
      themeStore.isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    ]"
  >
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y" :class="themeStore.isDark ? 'divide-gray-700' : 'divide-gray-200'">
        <thead :class="themeStore.isDark ? 'bg-gray-700' : 'bg-gray-50'">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-500'">
              Order ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-500'">
              Supplier
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-500'">
              Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-500'">
              Items
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-500'">
              Total
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-500'">
              Status
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-500'">
              Actions
            </th>
          </tr>
        </thead>
        <tbody :class="themeStore.isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'">
          <tr
            v-for="purchase in purchases"
            :key="purchase.id"
            :class="[
              'transition cursor-pointer',
              themeStore.isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            ]"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-primary">{{ purchase.id }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img class="h-10 w-10 rounded-full" :src="purchase.supplier.avatar" alt="" />
                </div>
                <div class="ml-4">
                  <div :class="themeStore.isDark ? 'text-white' : 'text-gray-900'" class="text-sm font-medium">
                    {{ purchase.supplier.name }}
                  </div>
                  <div :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'" class="text-sm">
                    {{ purchase.supplier.email }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div :class="themeStore.isDark ? 'text-white' : 'text-gray-900'" class="text-sm">{{ purchase.date }}</div>
              <div :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'" class="text-sm">
                Due: {{ purchase.dueDate }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div :class="themeStore.isDark ? 'text-white' : 'text-gray-900'" class="text-sm">
                {{ purchase.items }} items
              </div>
              <div :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'" class="text-sm">
                {{ purchase.categories }} categories
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div :class="themeStore.isDark ? 'text-white' : 'text-gray-900'" class="text-sm font-bold">
                {{ purchase.total }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  statusClass(purchase.status)
                ]"
              >
                {{ purchase.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-primary hover:text-primary/80 mr-3">
                <i class="fas fa-eye"></i>
              </button>
              <button
                @click.stop="$emit('edit-purchase', purchase)"
                class="text-blue-500 hover:text-blue-800 mr-3"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button class="text-red-500 hover:text-red-800">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref , onMounted } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { apiFetch } from '@/utils/api';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore(); 
defineEmits(['edit-purchase']);

const themeStore = useThemeStore();
const purchases = ref([]);


// const purchases = ref([
//   {
//     id: '#PO-2023-001',
//     supplier: {
//       name: 'Global Suppliers Inc.',
//       email: 'john.supplier@example.com',
//       avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//     },
//     date: 'May 15, 2023',
//     dueDate: 'May 22, 2023',
//     items: 12,
//     categories: 3,
//     total: '$1,245.00',
//     status: 'Delivered',
//   },
//   // other purchases here
// ]);

// Fetch purchases from backend
const fetchPurchases = async () => {
  try {
    const shopId = authStore.getShopId();
    const data  = await apiFetch(`/purchase-orders/${shopId}/recent`);
    purchases.value = data;
    console.log('Purchases loaded:', purchases.value);
  } catch (error) {
    console.error('Error fetching purchases:', error);
  }
};


// Status CSS mapping
const statusClass = (status) => {
  const statusMap = {
    Delivered: 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900',
    Ordered: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900',
    In_transit: 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900',
    Received: 'bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900',
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900';
};

// Fetch purchases on component mount
onMounted(() => {
  fetchPurchases();
});
</script>
