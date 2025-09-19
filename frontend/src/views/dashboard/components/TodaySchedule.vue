<template>
  <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-white font-semibold">Today's Bookings</div>
        <div class="text-xs text-white/60">Scheduled car wash services</div>
      </div>
      <div class="text-xs text-white/60">{{ todayDate }}</div>
    </div>
    <div class="mt-4 grid gap-3">
      <div v-for="(b, idx) in bookings" :key="idx" class="p-3 rounded-lg bg-white/4 flex items-center justify-between">
        <div>
          <div class="text-sm text-white/90">{{ b.time }} — {{ b.customer }}</div>
          <div class="text-xs text-white/60">{{ b.servicePackage }}</div>
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1 rounded-md bg-gradient-to-r from-emerald-400 to-sapphire-500">Start</button>
          <button class="px-3 py-1 rounded-md bg-white/6">Details</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
defineProps({ bookings: Array })
const todayDate = computed(() =>
  new Date().toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric'})
)
</script>
