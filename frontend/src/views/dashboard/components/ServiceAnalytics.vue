<template>
  <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
    <div class="flex items-center justify-between mb-4">
      <div>
        <div class="text-white font-semibold">Service Analytics</div>
        <div class="text-xs text-white/60">Insights on bookings & revenue</div>
      </div>
    </div>

    <div class="grid gap-4">
      <div class="flex justify-between items-center bg-white/5 p-3 rounded-lg">
        <div>Total Bookings</div>
        <div class="font-bold text-emerald-400">{{ analytics.totalBookings }}</div>
      </div>
      <div class="flex justify-between items-center bg-white/5 p-3 rounded-lg">
        <div>Total Revenue</div>
        <div class="font-bold text-emerald-400">₹{{ analytics.revenue }}</div>
      </div>
      <div class="flex justify-between items-center bg-white/5 p-3 rounded-lg">
        <div>Average Rating</div>
        <div class="font-bold text-emerald-400">{{ analytics.avgRating }}</div>
      </div>
      <div class="mt-2">
        <div class="text-xs text-white/60 mb-1">Weekly Booking Trend</div>
        <div class="bg-white/10 rounded-lg p-2">
          <div class="grid grid-cols-7 gap-1">
            <div v-for="(b, i) in analytics.trends.bookings" :key="i" class="bg-emerald-400 rounded" :style="{ height: `${b}px` }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ analytics: Object })
</script>
