<template>
  <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-white font-semibold">Bookings & Payments</div>
        <div class="text-xs text-white/60">Pending and completed services</div>
      </div>
      <div class="text-xs text-white/60">{{ bookings.length }} items</div>
    </div>

    <div class="mt-4 grid gap-3">
      <div v-for="b in bookings" :key="b.id" class="p-3 rounded-lg bg-white/4 flex items-center justify-between border border-white/10">
        <div>
          <div class="text-sm text-white/90 font-semibold">{{ b.customer }}</div>
          <div class="text-xs text-white/60">{{ b.servicePackage }} • Time: {{ b.time }}</div>
          <div class="text-xs text-white/60 mt-2">
            Status: <strong>{{ b.status }}</strong> • Payment: {{ b.paymentStatus }}
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <button @click="updateBooking(b.id)" class="px-3 py-1 rounded-md text-sm bg-gradient-to-r from-emerald-400 to-sapphire-500">Update</button>
          <button class="px-3 py-1 rounded-md text-sm bg-white/6">Invoice</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ bookings: Array })
const updateBooking = (id) => alert(`Open booking update for ${id}`)
</script>
