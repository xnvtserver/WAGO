<!-- src/views/OrdersView.vue -->
<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-bold mb-6">എന്റെ ഓർഡറുകൾ</h1>
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium">ഓർഡർ ഐഡി</th>
              <th class="px-6 py-3 text-left text-sm font-medium">തീയതി</th>
              <th class="px-6 py-3 text-left text-sm font-medium">സ്റ്റാറ്റസ്</th>
              <th class="px-6 py-3 text-right text-sm font-medium">ആകെ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id">
              <td class="px-6 py-4 text-sm">#{{ order.id }}</td>
              <td class="px-6 py-4 text-sm">{{ order.date }}</td>
              <td class="px-6 py-4 text-sm">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-right">₹{{ order.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  const orders = ref([
    {
      id: 1234,
      date: '2023-10-05',
      status: 'Completed',
      total: 1560
    },
    // Add more sample orders
  ])
  </script>