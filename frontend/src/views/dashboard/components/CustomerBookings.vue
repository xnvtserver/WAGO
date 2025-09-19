<template>
  <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-white font-semibold">My Bookings</div>
        <div class="text-xs text-white/60">Your scheduled car wash services</div>
      </div>
      <button class="px-3 py-1 rounded-md bg-gradient-to-r from-emerald-400 to-sapphire-500 text-sm">
        New Booking
      </button>
    </div>

    <div class="mt-4 grid gap-3">
      <div v-for="b in bookings" :key="b.id"
        class="p-3 rounded-lg bg-white/4 flex justify-between items-center border border-white/10">
        <div>
          <div class="text-sm text-white/90 font-semibold">{{ b.servicePackage }}</div>
          <div class="text-xs text-white/60">Date: {{ b.date }} • Time: {{ b.time }}</div>
          <div class="text-xs text-white/60">Assigned: {{ b.staff }}</div>
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1 rounded-md bg-white/6 text-sm">Details</button>
          <button v-if="b.status === 'upcoming'" class="px-3 py-1 rounded-md bg-gradient-to-r from-emerald-400 to-sapphire-500 text-sm">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ bookings: Array })
</script>
