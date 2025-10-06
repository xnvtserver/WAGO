<script setup>
import { ref, onMounted } from "vue";
import { apiFetch } from '@/utils/api';

const props = defineProps({
  shopId: {
    type: Number,
    required: true,
  },
});

const transactions = ref([]);
const loading = ref(true);

onMounted(async () => {
  console.log("🔄 Fetching sales for shopId:", props.shopId);

  try {
    // apiFetch already returns parsed JSON
    const data = await apiFetch(`/sales/${props.shopId}/recent`);
    console.log("✅ API response:", data);

    // Handle both { transactions: [...] } and just [...]
    transactions.value = data?.transactions || data || [];

    console.log("📊 Transactions after parsing:", transactions.value);
  } catch (err) {
    console.error("🔥 Fetch error:", err);
  } finally {
    loading.value = false;
    console.log("⏹️ Loading finished");
  }
});
</script>

<template>
  <div class="p-4 bg-white rounded-2xl shadow-md">
    <h2 class="text-xl font-semibold mb-4">Recent Sales</h2>

    <div v-if="loading" class="text-gray-500">Loading sales...</div>

    <div v-else-if="transactions.length === 0" class="text-gray-500">
      No recent sales found.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="bg-gray-100 text-left text-sm font-medium text-gray-700">
            <th class="px-4 py-2">ID</th>
            <th class="px-4 py-2">Date</th>
            <th class="px-4 py-2">Customer</th>
            <th class="px-4 py-2">Items</th>
            <th class="px-4 py-2">Payment</th>
            <th class="px-4 py-2">Status</th>
            <th class="px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in transactions"
            :key="i"
            class="border-b text-sm hover:bg-gray-50"
          >
            <td class="px-4 py-2 font-mono">{{ row.id }}</td>
            <td class="px-4 py-2">{{ row.date }}</td>
            <td class="px-4 py-2">{{ row.customer }}</td>
            <td class="px-4 py-2">{{ row.items }}</td>
            <td class="px-4 py-2">{{ row.payment }}</td>
            <td class="px-4 py-2">
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="row.statusClass"
              >
                {{ row.status }}
              </span>
            </td>
            <td class="px-4 py-2 font-semibold">{{ row.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
